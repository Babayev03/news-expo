import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './tab-navigator';
import NewsDetail from '~/screens/news-detail';
import { useTheme } from '~/hooks/useTheme';
import { AnimatedHeaderTitle } from '~/components/common';
import { RootStackParamList } from './types';

export type { RootStackParamList };

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { navigationTheme, isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="NewsDetail"
            component={NewsDetail}
            options={({ route, navigation }) => ({
              headerShown: true,
              header: () => (
                <AnimatedHeaderTitle
                  title={route.params.article.title}
                  navigation={navigation}
                  articleId={route.params.article.id}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default RootNavigator;
