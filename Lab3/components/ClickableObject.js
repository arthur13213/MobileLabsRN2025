import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  State,
  Directions
} from 'react-native-gesture-handler';
import colors from '../constants/colors';

const ClickableObject = ({ 
  onTap, 
  onDoubleTap, 
  onLongPress, 
  onPan, 
  onFlingLeft, 
  onFlingRight, 
  onPinch 
}) => {
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  
  // Animation message
  const [message, setMessage] = useState('');
  const messageOpacity = useRef(new Animated.Value(0)).current;

  // Show animation message
  const showMessage = (text) => {
    setMessage(text);
    Animated.sequence([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Tap handler
  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Trigger the tap animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      showMessage('Клік! +1');
      onTap && onTap();
    }
  };
  
  // Double tap handler
  const onDoubleHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Trigger the double tap animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      showMessage('Подвійний клік! +2');
      onDoubleTap && onDoubleTap();
    }
  };
  
  // Long press handler
  const onLongPressHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Trigger the long press animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      showMessage('Утримання! +5');
      onLongPress && onLongPress();
    }
  };
  
  // Pan handler
  const onPanHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      translateX.setValue(translateX._value + event.nativeEvent.translationX);
      translateY.setValue(translateY._value + event.nativeEvent.translationY);
      
      // Only trigger once
      if (event.nativeEvent.oldState === State.BEGAN) {
        showMessage('Перетягування! +3');
        onPan && onPan();
      }
    }
  };
  
  // Fling right handler
  const onFlingRightHandler = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Trigger fling right animation
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: translateX._value + 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: translateX._value,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      showMessage(`Свайп вправо! +${randomPoints}`);
      onFlingRight && onFlingRight(randomPoints);
    }
  };
  
  // Fling left handler
  const onFlingLeftHandler = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Trigger fling left animation
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: translateX._value - 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: translateX._value,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      showMessage(`Свайп вліво! +${randomPoints}`);
      onFlingLeft && onFlingLeft(randomPoints);
    }
  };
  
  // Pinch handler
  const onPinchHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      pinchScale.setValue(event.nativeEvent.scale);
      
      // Only trigger once per pinch
      if (Math.abs(event.nativeEvent.scale - 1) > 0.3 && 
          event.nativeEvent.oldState === State.BEGAN) {
        const points = event.nativeEvent.scale > 1 ? 7 : 4;
        showMessage(`${event.nativeEvent.scale > 1 ? 'Збільшення' : 'Зменшення'}! +${points}`);
        onPinch && onPinch(points);
      }
    }
    
    if (event.nativeEvent.state === State.END) {
      Animated.spring(pinchScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  // Rotate animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Define interpolation for rotation
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const doubleTapRef = useRef(null);
  const longPressRef = useRef(null);
  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const flingLeftRef = useRef(null);
  const flingRightRef = useRef(null);

  return (
    <View style={styles.container}>
      <FlingGestureHandler
        ref={flingRightRef}
        direction={Directions.RIGHT}
        onHandlerStateChange={onFlingRightHandler}>
        <FlingGestureHandler
          ref={flingLeftRef}
          direction={Directions.LEFT}
          onHandlerStateChange={onFlingLeftHandler}>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchHandler}
            onHandlerStateChange={onPinchHandler}>
            <Animated.View>
              <PanGestureHandler
                ref={panRef}
                onGestureEvent={onPanHandler}
                onHandlerStateChange={onPanHandler}
                minPointers={1}
                maxPointers={1}>
                <Animated.View>
                  <LongPressGestureHandler
                    ref={longPressRef}
                    onHandlerStateChange={onLongPressHandler}
                    minDurationMs={1000}>
                    <Animated.View>
                      <TapGestureHandler
                        onHandlerStateChange={onSingleTap}
                        waitFor={doubleTapRef}>
                        <Animated.View>
                          <TapGestureHandler
                            ref={doubleTapRef}
                            onHandlerStateChange={onDoubleHandler}
                            numberOfTaps={2}>
                            <Animated.View
                              style={[
                                styles.clickableObject,
                                {
                                  transform: [
                                    { translateX },
                                    { translateY },
                                    { scale: Animated.multiply(scale, pinchScale) },
                                    { rotate: spin }
                                  ]
                                }
                              ]}>
                              <Text style={styles.emoji}>🎮</Text>
                            </Animated.View>
                          </TapGestureHandler>
                        </Animated.View>
                      </TapGestureHandler>
                    </Animated.View>
                  </LongPressGestureHandler>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>

      <Animated.View style={[styles.messageContainer, { opacity: messageOpacity }]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
  clickableObject: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 48,
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
  },
  message: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClickableObject;