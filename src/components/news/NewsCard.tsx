import React, { memo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '~/hooks/useTheme';
import { useNewsStore } from '~/store/newsStore';
import { NewsArticle } from '~/types/news';
import { RootStackParamList } from '~/navigation';
import { typography } from '~/styles/typography';
import { spacing } from '~/styles/spacing';
import { borderRadius } from '~/styles/spacing';
import { formatRelativeTime, truncateText } from '~/utils/helpers';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NewsCardProps {
  article: NewsArticle;
  onPress?: (article: NewsArticle) => void;
}

const NewsCard = memo(({ article, onPress }: NewsCardProps) => {
  const { colors } = useTheme();
  const { toggleFavorite, isFavorite } = useNewsStore();
  const navigation = useNavigation<NavigationProp>();

  const isArticleFavorite = isFavorite(article.id);
  const lastTapRef = useRef<number>(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const handleFavoritePress = () => {
    toggleFavorite(article.id);
  };

  const handleCardPress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected - like the article
      handleDoubleTap();
    } else {
      // Single tap - navigate to detail screen
      setTimeout(() => {
        if (Date.now() - lastTapRef.current >= DOUBLE_PRESS_DELAY) {
          if (onPress) {
            onPress(article);
          } else {
            navigation.navigate('NewsDetail', { article });
          }
        }
      }, DOUBLE_PRESS_DELAY);
    }

    lastTapRef.current = now;
  };

  const handleDoubleTap = () => {
    // Add to favorites if not already favorited
    if (!isArticleFavorite) {
      toggleFavorite(article.id);
    }

    // Trigger heart animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(heartScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handleCardPress}
      activeOpacity={0.8}>
      {/* Image */}
      {article.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            key={article.id}
          />
          {/* Double-tap heart animation */}
          <Animated.View
            style={[
              styles.doubleTapHeart,
              {
                transform: [{ scale: heartScale }],
                opacity: heartOpacity,
              },
            ]}>
            <FontAwesome name="heart" size={60} color={colors.error} />
          </Animated.View>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <View style={styles.header}>
          <Text style={[styles.category, { color: colors.primary }]}>{article.category.name}</Text>
          <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
            <FontAwesome
              name={isArticleFavorite ? 'heart' : 'heart-o'}
              size={20}
              color={isArticleFavorite ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {truncateText(article.title, 100)}
        </Text>

        {/* Summary */}
        <Text style={[styles.summary, { color: colors.textSecondary }]}>
          {truncateText(article.summary, 150)}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.author, { color: colors.textSecondary }]}>{article.author}</Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatRelativeTime(article.publishedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  doubleTapHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    zIndex: 1,
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
  category: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.lg,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  time: {
    fontSize: typography.fontSizes.sm,
  },
});

export default NewsCard;
