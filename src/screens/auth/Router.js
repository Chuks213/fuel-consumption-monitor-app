import * as React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCog } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';
import Home from './Home';
import Map from '../../components/MapLatest';
import AppColor from '../../styles/Colors';
import CustomHeader from '../../components/Header';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Router = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      header: props => <CustomHeader {...props} />,
      tabBarLabelStyle: {
        // fontSize: 11,
        // fontFamily: "Poppins-Regular",
        display: "none"
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let iconColor = focused ? (isDarkMode ? AppColor.white : AppColor.primary) : color;

        if (route.name === 'Home') {
          iconName = faHome;
        } else if (route.name === 'Settings') {
          iconName = faCog;
        }
        return <FontAwesomeIcon color={iconColor} icon={iconName} size={size} />
      },
      tabBarActiveTintColor: isDarkMode ? AppColor.white : AppColor.primary,
      tabBarInactiveTintColor: AppColor.lightGrey,
      tabBarStyle: {
        backgroundColor: isDarkMode ? AppColor.dark : AppColor.light
      }
    })}>
      {/* <Tab.Screen name="Home" component={Home} /> */}
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Main" >
      <Stack.Screen name="Main" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default Router;