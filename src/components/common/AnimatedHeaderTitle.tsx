import React, { useState } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Text, TouchableOpacity } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '~/styles/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { spacing } from '~/styles/spacing';
import { useNewsStore } from '~/store/newsStore';
import { useTheme } from '~/hooks';

type NavigationProp = StackNavigationProp<RootStackParamList, 'NewsDetail'>;

const MeasureElement = ({
  onLayout,
  children,
}: {
  onLayout: (width: number) => void;
  children: React.ReactNode;
}) => (
  <Animated.ScrollView horizontal style={marqueeStyles.hidden} pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
  </Animated.ScrollView>
);

const TranslatedElement = ({
  index,
  children,
  offset,
  childrenWidth,
}: {
  index: number;
  children: React.ReactNode;
  offset: SharedValue<number>;
  childrenWidth: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: (index - 1) * childrenWidth,
      transform: [
        {
          translateX: -offset.value,
        },
      ],
    };
  });
  return <Animated.View style={[styles.animatedStyle, animatedStyle]}>{children}</Animated.View>;
};

const getIndicesArray = (length: number) => Array.from({ length }, (_, i) => i);

const Cloner = ({
  count,
  renderChild,
}: {
  count: number;
  renderChild: (index: number) => React.ReactNode;
}) => <>{getIndicesArray(count).map(renderChild)}</>;

const ChildrenScroller = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
  shouldAnimate,
}: {
  duration: number;
  childrenWidth: number;
  parentWidth: number;
  reverse: boolean;
  children: React.ReactNode;
  shouldAnimate: boolean;
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? 1 : -1);

  React.useEffect(() => {
    coeff.value = reverse ? 1 : -1;
  }, [reverse, coeff]);

  useFrameCallback((i) => {
    if (shouldAnimate) {
      offset.value += (coeff.value * ((i.timeSincePreviousFrame ?? 1) * childrenWidth)) / duration;
      offset.value = offset.value % childrenWidth;
    }
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = (index: number) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({
  duration = 2000,
  reverse = false,
  children,
  style,
  shouldAnimate,
}: {
  duration?: number;
  reverse?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shouldAnimate: boolean;
}) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  return (
    <View
      style={style}
      onLayout={(ev) => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller
            duration={duration}
            parentWidth={parentWidth}
            childrenWidth={childrenWidth}
            reverse={reverse}
            shouldAnimate={shouldAnimate}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -1 },
  row: { flexDirection: 'row', overflow: 'hidden' },
});

const AnimatedHeaderTitle = ({
  title,
  navigation,
  articleId,
}: {
  title: string;
  navigation: NavigationProp;
  articleId: string;
}) => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { toggleFavorite, isFavorite } = useNewsStore();
  const isArticleFavorite = isFavorite(articleId);

  React.useEffect(() => {
    // Start animation after 1 second delay
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(articleId);
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: top, height: top + 56, backgroundColor: colors.card },
      ]}>
      {/* Back button */}
      <TouchableOpacity onPress={handleGoBack} style={styles.actionButton} activeOpacity={0.7}>
        <Feather name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Title container with fade effects */}
      <View style={styles.titleContainer}>
        <Marquee
          duration={title.length * 150}
          reverse={true}
          style={styles.marqueeContainer}
          shouldAnimate={shouldAnimate}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {' '.repeat(5) + title}
          </Text>
        </Marquee>

        {/* Left fade overlay */}
        <LinearGradient
          colors={[colors.card + 'FF', colors.card + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fadeOverlay, styles.leftFade]}
          pointerEvents="none"
        />

        {/* Right fade overlay */}
        <LinearGradient
          colors={[colors.card + '00', colors.card + 'FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fadeOverlay, styles.rightFade]}
          pointerEvents="none"
        />
      </View>

      {/* Favorite button */}
      <TouchableOpacity
        onPress={handleToggleFavorite}
        style={styles.actionButton}
        activeOpacity={0.7}>
        <FontAwesome
          name={isArticleFavorite ? 'heart' : 'heart-o'}
          size={20}
          color={isArticleFavorite ? colors.error : colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    position: 'relative',
    zIndex: 1,
  },
  actionButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  titleContainer: {
    flex: 1,
    height: 44,
    marginHorizontal: spacing.sm,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  marqueeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
    includeFontPadding: false,
  },
  animatedStyle: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
  },
  fadeOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 2,
  },
  leftFade: {
    left: 0,
  },
  rightFade: {
    right: 0,
  },
});

export default AnimatedHeaderTitle;
