import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StoreScreen from './screens/StoreScreen';
import CommunityScreen from './screens/CommunityScreen';
import ChatScreen from './screens/ChatScreen';
import SafetyScreen from './screens/SafetyScreen';
import ProfileScreen from './screens/ProfileScreen';
import { lightTheme, darkTheme } from './themes';

const Tab = createBottomTabNavigator();

// Create custom navigation themes based on our styled-components themes
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: lightTheme.background,
    card: lightTheme.cardBackground,
    text: lightTheme.text,
    primary: lightTheme.accent,
    border: lightTheme.borderColor,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: darkTheme.background,
    card: darkTheme.cardBackground,
    text: darkTheme.text,
    primary: darkTheme.accent,
    border: darkTheme.borderColor,
  },
};

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const navigationTheme = isDarkTheme ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const icons = {
                Store: 'storefront',
                Community: 'people',
                Chat: 'chatbubbles',
                Safety: 'shield',
                Profile: 'person',
              };
              return <Ionicons name={icons[route.name]} size={size} color={color} />;
            },
            tabBarStyle: {
              backgroundColor: theme.cardBackground,
              paddingBottom: 6,
              height: 60,
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: isDarkTheme ? '#aaa' : '#666',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Store">
            {(props) => <StoreScreen {...props} toggleTheme={toggleTheme} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Community">
            {(props) => <CommunityScreen {...props} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Chat">
            {(props) => <ChatScreen {...props} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Safety">
            {(props) => <SafetyScreen {...props} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {(props) => <ProfileScreen {...props} theme={theme} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}