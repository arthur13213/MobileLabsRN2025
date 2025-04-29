import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import TaskItem from '../components/TaskItem';
import { TASKS } from '../constants/tasks';
import colors from '../constants/colors';

const TasksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Список завдань</Text>
      <FlatList
        data={TASKS}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default TasksScreen;