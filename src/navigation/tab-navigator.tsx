import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Favorite from '~/screens/favorite';
import Home from '~/screens/home';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '~/hooks/useTheme';
import { Platform } from 'react-native';
import { typography } from '~/styles';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          color: colors.text,
          fontSize: typography.fontSizes.xxl,
          fontWeight: typography.fontWeights.bold,
        },
        animation: Platform.OS === 'ios' ? 'fade' : 'none',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorite}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
