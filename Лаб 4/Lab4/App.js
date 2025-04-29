import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Налаштування обробника сповіщень
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTime, setTaskTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  // Реєстрація для push-сповіщень
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Функція для реєстрації push-сповіщень
  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      Alert.alert('Помилка', 'Сповіщення працюють лише на фізичних пристроях');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Помилка', 'Дозвіл на сповіщення не надано!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  // Додавання задачі
  const addTask = async () => {
    if (!taskTitle || !taskDescription || !taskTime) {
      Alert.alert('Помилка', 'Заповніть усі поля!');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const notificationId = await schedulePushNotification(taskTitle, taskDescription, taskTime);

    const newTask = {
      id,
      title: taskTitle,
      description: taskDescription,
      time: taskTime,
      notificationId,
    };

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setTaskTime(new Date());
  };

  // Видалення задачі
  const deleteTask = async (taskId, notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Планування сповіщення
  async function schedulePushNotification(title, body, time) {
    const trigger = new Date(time);
    if (trigger < new Date()) {
      Alert.alert('Помилка', 'Час сповіщення має бути в майбутньому!');
      return;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });

    // Для OneSignal у локальному проєкті:
    // import { OneSignal } from 'react-native-onesignal';
    // OneSignal.Notifications.scheduleNotification({
    //   title,
    //   message: body,
    //   send_at: Math.round(trigger.getTime() / 1000),
    //   identifier,
    // });

    return identifier;
  }

  // Рендеринг елемента задачі
  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{item.time.toLocaleString()}</Text>
      </View>
      <Button title="Видалити" onPress={() => deleteTask(item.id, item.notificationId)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To-Do Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Назва задачі"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Опис задачі"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />
      <Button title="Вибрати час" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={taskTime}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setTaskTime(selectedDate);
          }}
        />
      )}
      <Button title="Додати задачу" onPress={addTask} />

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});