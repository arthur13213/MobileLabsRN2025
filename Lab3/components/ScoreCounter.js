import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '../constants/colors';

const ScoreCounter = ({ score, lastPoints }) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (lastPoints > 0) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Очки:</Text>
      <Animated.Text 
        style={[
          styles.score, 
          { transform: [{ scale: animatedValue }] }
        ]}
      >
        {score}
      </Animated.Text>
      
      {lastPoints > 0 && (
        <Animated.Text 
          style={[
            styles.lastPoints,
            { opacity: animatedValue.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0, 1]
              }) 
            }
          ]}
        >
          +{lastPoints}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 5,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  lastPoints: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    right: 20,
    top: 20,
  },
});

export default ScoreCounter;