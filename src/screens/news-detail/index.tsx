import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme } from '~/hooks/useTheme';
import { NewsArticle } from '~/types/news';
import { typography } from '~/styles/typography';
import { spacing } from '~/styles/spacing';
import { borderRadius } from '~/styles/spacing';
import { formatRelativeTime } from '~/utils/helpers';

type NewsDetailRouteParams = {
  NewsDetail: {
    article: NewsArticle;
  };
};

type NewsDetailRouteProp = RouteProp<NewsDetailRouteParams, 'NewsDetail'>;

const NewsDetail = () => {
  const route = useRoute<NewsDetailRouteProp>();
  const { article } = route.params;
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {article.imageUrl && (
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} resizeMode="cover" />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Category and Date */}
          <View style={styles.meta}>
            <Text style={[styles.category, { color: colors.primary }]}>
              {article.category.name}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatRelativeTime(article.publishedAt)}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

          {/* Author */}
          <Text style={[styles.author, { color: colors.textSecondary }]}>By {article.author}</Text>

          {/* Summary */}
          <Text style={[styles.summary, { color: colors.text }]}>{article.summary}</Text>

          {/* Content */}
          <Text style={[styles.articleContent, { color: colors.text }]}>{article.content}</Text>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {article.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Source */}
          <View style={styles.sourceContainer}>
            <Text style={[styles.sourceLabel, { color: colors.textSecondary }]}>Source:</Text>
            <Text style={[styles.sourceText, { color: colors.primary }]}>
              {article.sourceUrl ? new URL(article.sourceUrl).hostname : 'Unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: spacing.lg,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  category: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: typography.fontSizes.sm,
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.xxxl,
    marginBottom: spacing.md,
  },
  author: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.lg,
  },
  summary: {
    fontSize: typography.fontSizes.lg,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.lg,
  },
  articleContent: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.md,
    marginBottom: spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: typography.fontSizes.sm,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: typography.fontSizes.sm,
    marginRight: spacing.sm,
  },
  sourceText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});

export default NewsDetail;
