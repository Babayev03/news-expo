import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '~/hooks/useTheme';
import { typography } from '~/styles/typography';
import { spacing } from '~/styles/spacing';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text = 'Loading...',
  color,
}) => {
  const { colors } = useTheme();
  const spinnerColor = color || colors.primary;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  text: {
    fontSize: typography.fontSizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
