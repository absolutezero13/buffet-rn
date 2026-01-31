import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";
import { useApp } from "../../context/AppContext";
import { OnboardingSlide, Button } from "../../components";

const { width } = Dimensions.get("window");

const slides = [
  {
    emoji: "🦬",
    title: "Welcome to Buffet AI",
    description:
      "Your intelligent investment companion. Track all your assets in one place with real-time insights.",
  },
  {
    emoji: "📊",
    title: "Track Everything",
    description:
      "Stocks, ETFs, crypto, gold - manage your entire portfolio effortlessly with a beautiful interface.",
  },
  {
    emoji: "🤖",
    title: "AI-Powered Insights",
    description:
      "Chat with our AI assistant to get personalized investment advice and market analysis.",
  },
  {
    emoji: "🚀",
    title: "Ready to Start?",
    description:
      "Build wealth like Warren Buffett. Let's begin your investment journey today!",
  },
];

export function Welcome() {
  const { setHasOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setHasOnboarded(true);
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <OnboardingSlide
            emoji={item.emoji}
            title={item.title}
            description={item.description}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      <View style={styles.buttons}>
        {currentIndex < slides.length - 1 && (
          <Button
            title="Skip"
            variant="ghost"
            onPress={handleSkip}
            style={styles.skipButton}
          />
        )}
        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth={currentIndex === slides.length - 1}
          style={
            currentIndex === slides.length - 1
              ? styles.getStartedButton
              : styles.nextButton
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: "space-between",
  },
  skipButton: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  nextButton: {
    flex: 2,
  },
  getStartedButton: {
    flex: 1,
  },
});
