import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '~/hooks/useTheme';
import { useNewsStore } from '~/store/newsStore';
import { NewsCard } from '~/components/news';
import { NewsArticle } from '~/types/news';
import { typography } from '~/styles/typography';
import { spacing } from '~/styles/spacing';
import { useScrollToTop } from '@react-navigation/native';

const Favorite = () => {
  const flashRef = useRef<FlashList<NewsArticle>>(null);
  useScrollToTop(flashRef);

  const { colors } = useTheme();
  const { getFavoriteArticles, favorites } = useNewsStore();

  const favoriteArticles = getFavoriteArticles();

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => <NewsCard article={item} />,
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>💙</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Start adding articles to your favorites by tapping the heart icon on any news card
        </Text>
      </View>
    ),
    [colors]
  );

  const keyExtractor = useCallback((item: NewsArticle) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        ref={flashRef}
        data={favoriteArticles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
    maxWidth: 300,
  },
});

export default Favorite;
