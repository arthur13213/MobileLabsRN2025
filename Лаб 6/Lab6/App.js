import React, { createContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Mock Firebase для Snack
const mockFirebase = {
  auth: {
    signInWithEmailAndPassword: async (email, password) => {
      if (email && password) {
        return { user: { uid: 'mock-uid', email } };
      }
      throw new Error('Невірний email або пароль');
    },
    createUserWithEmailAndPassword: async (email, password) => {
      if (email && password) {
        return { user: { uid: 'mock-uid', email } };
      }
      throw new Error('Помилка реєстрації');
    },
    sendPasswordResetEmail: async (email) => {
      if (email) {
        return true;
      }
      throw new Error('Невірний email');
    },
    signOut: async () => true,
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(mockFirebase.auth.currentUser);
      return () => {};
    },
    EmailAuthProvider: {
      credential: (email, password) => ({ email, password }),
    },
  },
  firestore: () => ({
    collection: () => ({
      doc: (id) => ({
        set: async (data) => data,
        get: async () => ({
          exists: true,
          data: () => ({ name: '', age: '', city: '' }),
        }),
        delete: async () => true,
      }),
    }),
  }),
};

// Контекст авторизації
export const AuthContext = createContext();

const Stack = createNativeStackNavigator();

// Провайдер авторизації
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    checkAuth();

    const unsubscribe = mockFirebase.auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Екран входу
const LoginScreen = ({ navigation }) => {
  console.log('LoginScreen rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await mockFirebase.auth.signInWithEmailAndPassword(email, password);
      navigation.replace('AppStack');
    } catch (error) {
      Alert.alert('Помилка', error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.title}>Вхід</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Увійти</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Немає акаунта? Зареєструйтесь</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.link}>Забули пароль?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Екран реєстрації
const RegisterScreen = ({ navigation }) => {
  console.log('RegisterScreen rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await mockFirebase.auth.createUserWithEmailAndPassword(email, password);
      navigation.replace('AppStack');
    } catch (error) {
      Alert.alert('Помилка', error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.title}>Реєстрація</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Зареєструватись</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Вже маєте акаунт? Увійдіть</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Екран скидання пароля
const ResetPasswordScreen = ({ navigation }) => {
  console.log('ResetPasswordScreen rendered');
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await mockFirebase.auth.sendPasswordResetEmail(email);
      Alert.alert('Успіх', 'Лист для скидання пароля відправлено');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Помилка', error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.title}>Скидання пароля</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Надіслати лист</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Назад до входу</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Екран профілю
const ProfileScreen = ({ navigation }) => {
  console.log('ProfileScreen rendered');
  const { user } = React.useContext(AuthContext);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    if (user) {
      mockFirebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setName(data.name || '');
            setAge(data.age || '');
            setCity(data.city || '');
          }
        });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await mockFirebase.firestore().collection('users').doc(user.uid).set({
        name,
        age,
        city,
      });
      Alert.alert('Успіх', 'Профіль збережено');
    } catch (error) {
      Alert.alert('Помилка', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const credential = mockFirebase.auth.EmailAuthProvider.credential(
        user.email,
        deletePassword
      );
      if (credential) {
        await mockFirebase.firestore().collection('users').doc(user.uid).delete();
        mockFirebase.auth.currentUser = null;
        Alert.alert('Успіх', 'Акаунт видалено');
        setModalVisible(false);
        navigation.replace('GuestStack');
      }
    } catch (error) {
      Alert.alert('Помилка', error.message);
    }
  };

  const handleLogout = async () => {
    await mockFirebase.auth.signOut();
    navigation.replace('GuestStack');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.title}>Ваш профіль</Text>
        <TextInput
          style={styles.input}
          placeholder="Ім’я"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Вік"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Місто"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Зберегти профіль</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Видалити акаунт</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Вийти</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Підтвердження видалення</Text>
            <TextInput
              style={styles.input}
              placeholder="Введіть пароль"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.buttonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Навігація
const GuestStack = () => {
  console.log('GuestStack rendered');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  console.log('AppStack rendered');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Головний компонент із навігацією
const MainApp = () => {
  console.log('MainApp rendered');
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <GuestStack />}
    </NavigationContainer>
  );
};

// Основний компонент
export default function App() {
  console.log('App rendered');
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#4682B4',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});