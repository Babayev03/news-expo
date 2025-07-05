import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '~/hooks/useTheme';
import { spacing } from '~/styles/spacing';
import { borderRadius } from '~/styles/spacing';
import { Skeleton } from 'moti/skeleton';

const SkeletonCard: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Image skeleton */}
      <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={0} height={200} width="100%" />

      {/* Content skeleton */}
      <View style={styles.content}>
        {/* Category and heart skeleton */}
        <View style={styles.header}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={14} width={80} />
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={10} height={20} width={20} />
        </View>

        {/* Title skeleton */}
        <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={18} width="100%" />
        <View style={{ marginTop: spacing.xs }}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={18} width="75%" />
        </View>

        {/* Summary skeleton */}
        <View style={{ marginTop: spacing.sm }}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={14} width="100%" />
        </View>
        <View style={{ marginTop: spacing.xs }}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={14} width="90%" />
        </View>
        <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={14} width="60%" />
        </View>

        {/* Footer skeleton */}
        <View style={styles.footer}>
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={12} width={100} />
          <Skeleton colorMode={isDark ? 'dark' : 'light'} radius={4} height={12} width={60} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SkeletonCard;
