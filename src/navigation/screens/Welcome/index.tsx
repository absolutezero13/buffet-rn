import React, { useRef, useState } from "react";
import { View, FlatList, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../theme";
import { useApp } from "../../../context/AppContext";
import { OnboardingSlide } from "../../../components";
import { PaginationDots, WelcomeButtons } from "./components";
import { SLIDES } from "./constants";
import { styles } from "./styles";

export function Welcome() {
  const { setHasOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
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
        data={SLIDES}
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

      <PaginationDots slides={SLIDES} scrollX={scrollX} />

      <WelcomeButtons
        currentIndex={currentIndex}
        totalSlides={SLIDES.length}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </View>
  );
}
