// src/Navigation/AppNavigator.jsx
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import all your screens
import LandingScreen from '../Screens/LandingScreen';
import LoginScreen from '../Screens/Login_Signup/LoginScreen';
import SignupScreen from '../Screens/Login_Signup/SignupScreen';
import HomeSearch from '../Screens/Home/HomeSearch'; // Assuming HomeSearch is your HomeScreen
import SearchResultsScreen from '../Screens/SearchResults/SearchResultScreen';
import NotificationScreen from '../Screens/Notifications/NotificationScreen';
import ReportScreen from '../Screens/Report/ReportScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- AUTHENTICATION STACK ---
// This stack handles the flow BEFORE the user is logged in.
const AuthStack = ({ onLogin }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    {/* Use a render prop for LoginScreen to pass down the onLogin function */}
    <Stack.Screen name="Login">
      {props => <LoginScreen {...props} onLogin={onLogin} />}
    </Stack.Screen>
   <Stack.Screen name="Signup">
      {props => <SignupScreen {...props} onLogin={onLogin} />}
    </Stack.Screen>
  </Stack.Navigator>
);

// --- HOME STACK ---
// This is a nested stack for the "Home" tab.
// It allows you to navigate from HomeScreen to SearchResultsScreen.
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeSearch} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
  </Stack.Navigator>
);

// --- MAIN TAB NAVIGATOR ---
// This is the main navigator for when the user IS logged in.
const MainTabs = ({onLogout}) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#8E4DFF',
      tabBarHideOnKeyboard: true, 
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home-variant',
          Notifications: 'bell-outline',
          Report: 'alert-octagon',
          Profile: 'account-circle-outline',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Notifications" component={NotificationScreen} />
    <Tab.Screen name="Report" component={ReportScreen} />
    <Tab.Screen name="Profile">
      {props => <ProfileScreen {...props} onLogout={onLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);

// --- ROOT NAVIGATOR ---
// This is the main component that decides which stack to show.
const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Create the functions to change the login state
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false); // We can use this later

  return (
    // Pass the handleLogin function to the AuthStack
    <>{isLoggedIn ? <MainTabs onLogout={handleLogout} /> : <AuthStack onLogin={handleLogin} />}</>
  );
};

export default AppNavigator;