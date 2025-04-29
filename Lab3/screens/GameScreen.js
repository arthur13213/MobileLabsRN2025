import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ClickableObject from '../components/ClickableObject';
import ScoreCounter from '../components/ScoreCounter';
import { TASKS } from '../constants/tasks';
import colors from '../constants/colors';

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [tasks, setTasks] = useState(TASKS);

  // Оновлення завдання за типом
  const updateTaskProgress = (type, increment = 1, points = 0) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.type === type && !task.completed) {
          const newCurrent = Math.min(task.current + increment, task.target);
          const completed = newCurrent >= task.target;
          return { ...task, current: newCurrent, completed };
        }
        return task;
      })
    );
    if (points > 0) {
      setScore((prev) => prev + points);
      setLastPoints(points);
      setTimeout(() => setLastPoints(0), 1000); // Скинути lastPoints через 1с
    }
  };

  // Оновлення завдання для очок
  useEffect(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.type === 'score' && !task.completed) {
          const newCurrent = Math.min(score, task.target);
          const completed = newCurrent >= task.target;
          return { ...task, current: newCurrent, completed };
        }
        return task;
      })
    );
  }, [score]);

  // Обробники жестів
  const handleTap = () => updateTaskProgress('tap', 1, 1);
  const handleDoubleTap = () => updateTaskProgress('doubleTap', 1, 2);
  const handleLongPress = () => updateTaskProgress('longPress', 1, 5);
  const handlePan = () => updateTaskProgress('pan', 1, 3);
  const handleFlingRight = (points) => updateTaskProgress('flingRight', 1, points);
  const handleFlingLeft = (points) => updateTaskProgress('flingLeft', 1, points);
  const handlePinch = (points) => updateTaskProgress('pinch', 1, points);

  return (
    <View style={styles.container}>
      <ScoreCounter score={score} lastPoints={lastPoints} />
      <ClickableObject
        onTap={handleTap}
        onDoubleTap={handleDoubleTap}
        onLongPress={handleLongPress}
        onPan={handlePan}
        onFlingRight={handleFlingRight}
        onFlingLeft={handleFlingLeft}
        onPinch={handlePinch}
      />
      <Text style={styles.instruction}>
        Виконуйте жести для отримання очок і завершення завдань!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  instruction: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default GameScreen;