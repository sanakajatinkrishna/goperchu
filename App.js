import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import firebase from '@react-native-firebase/app';
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import HomeScreen from './screens/Homescreen';
import RestaurantListScreen from './screens/Restaurantlistscreen'; // Updated import path
import RestaurantScreen from './screens/Restaurantscreen'; // Updated import path
import ParkingListScreen from './screens/Parkinglistscreen'; // Updated import path
import ParkingScreen from './screens/Parkingscreen'; // Updated import path
import ArcadeListScreen from './screens/Arcadelistscreen'; // Updated import path
import LayoutScreen from './screens/Layoutscreen'; // Updated import path

// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAQAPSwMwK6lHbox07FCxZAvxYRDZQVoYE',
  authDomain: 'goperchui-9debc.firebaseapp.com',
  databaseURL:
    'https://goperchui-9debc-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'goperchui-9debc',
  storageBucket: 'goperchui-9debc.appspot.com',
  messagingSenderId: '965251192205',
  appId: '1:965251192205:web:3b833f85b804bb986359c4',
  measurementId: 'G-CC4JY8BNLF',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ParkingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ParkingList" component={ParkingListScreen} />
    <Stack.Screen name="ParkingScreen" component={ParkingScreen} />{' '}
    {/* Updated screen name */}
  </Stack.Navigator>
);

const ArcadeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ArcadeList" component={ArcadeListScreen} />
    <Stack.Screen name="LayoutScreen" component={LayoutScreen} />{' '}
    {/* Updated screen name */}
  </Stack.Navigator>
);

const RestaurantStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RestaurantListScreen"
      component={RestaurantListScreen}
    />{' '}
    {/* Updated screen name */}
    <Stack.Screen name="RestaurantScreen" component={RestaurantScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantStack} />
      <Tab.Screen name="Parking" component={ParkingStack} />
      <Tab.Screen name="Arcade" component={ArcadeStack} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default App;
