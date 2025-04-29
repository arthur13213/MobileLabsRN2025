import React from 'react';
import { View, Text, Image, StatusBar, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import PhotosScreen from './PhotosScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomHeader() {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: 'https://ztu.edu.ua/img/logo/university-white.png' }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

function FooterInfo() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Кот Артур Миколайович • ІПЗ-21-5</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <CustomHeader />,
          tabBarIcon: ({ color, size }) => {
            const icons = {
              'Головна': 'home-outline',
              'Фотогалерея': 'image-outline',
              'Профіль': 'person-circle-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0a84ff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            paddingVertical: 8,
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Головна" component={HomeScreen} />
        <Tab.Screen name="Фотогалерея" component={PhotosScreen} />
        <Tab.Screen name="Профіль" component={ProfileScreen} />
      </Tab.Navigator>
      <FooterInfo />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0a84ff',
    paddingTop: Platform.OS === 'android' ? 40 : 30,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  footer: {
    backgroundColor: '#0a84ff',
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
  },
});
