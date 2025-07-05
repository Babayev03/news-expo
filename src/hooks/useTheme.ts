import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { lightTheme, darkTheme, ThemeColors } from '~/styles/colors';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // App theme colors
  const colors: ThemeColors = isDark ? darkTheme : lightTheme;

  // React Navigation theme
  const navigationTheme: Theme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.notification,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.notification,
        },
      };

  return {
    colors,
    navigationTheme,
    isDark,
    colorScheme,
  };
}
