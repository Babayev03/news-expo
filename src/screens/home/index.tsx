import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '~/hooks/useTheme';
import { useNewsData } from '~/hooks/useNewsData';
import { NewsCard } from '~/components/news';
import { SkeletonCard } from '~/components/common';
import { NewsArticle } from '~/types/news';
import { typography } from '~/styles/typography';
import { spacing } from '~/styles/spacing';
import { useScrollToTop } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const Home = () => {
  const flashRef = useRef<FlashList<NewsArticle>>(null);
  useScrollToTop(flashRef);

  const { colors } = useTheme();
  const {
    articles,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    isOffline,
    refreshNews,
    loadMoreNews,
  } = useNewsData();

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => <NewsCard article={item} />,
    []
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading more articles...
        </Text>
      </View>
    );
  }, [isLoadingMore, colors.primary, colors.textSecondary]);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </Animated.View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {isOffline ? 'Showing cached articles' : 'Pull to refresh and try again'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No articles available
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Pull down to refresh
        </Text>
      </View>
    );
  }, [isLoading, error, isOffline, colors]);

  const keyExtractor = useCallback((item: NewsArticle) => item.id, []);

  const onEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMoreNews();
    }
  }, [hasMore, isLoadingMore, loadMoreNews]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Offline indicator */}
      {isOffline && (
        <View style={[styles.offlineIndicator, { backgroundColor: colors.warning }]}>
          <Text style={[styles.offlineText, { color: colors.onSecondary }]}>
            📱 Offline Mode - Showing cached articles
          </Text>
        </View>
      )}

      <FlashList
        ref={flashRef}
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshNews}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        estimatedItemSize={350}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: spacing.md,
  },
  offlineIndicator: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  loadingFooter: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.sm,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    fontWeight: typography.fontWeights.medium,
  },
});

export default Home;
