import React, { useRef, useState } from "react";
import { View, FlatList, Animated, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../theme";
import { OnboardingSlide } from "../../../components";
import { PaginationDots, WelcomeButtons } from "./components";
import { SLIDES } from "./constants";
import { styles } from "./styles";
import { currencyOptions, STORAGE_KEYS } from "../../constants";
import useUserStore from "../../../store/useUserStore";
import useCurrencyStore from "../../../store/useCurrencyStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currency, setUserCurrency] = useState(currencyOptions[0]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      useUserStore.setState({ hasOnboarded: true });
      await useCurrencyStore.getState().setUserCurrency(currency);
      AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({ hasOnboarded: true }),
      );
    }
  };

  const handleSkip = async () => {
    useUserStore.setState({ hasOnboarded: true });
    // Set default currency (USD)
    await useCurrencyStore.getState().setUserCurrency(currencyOptions[0]);
    AsyncStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({ hasOnboarded: true }),
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderCurrencySelector = () => (
    <View style={styles.currencyOptions}>
      {currencyOptions.map((option) => {
        const isActive = option.id === currency?.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.currencyOption,
              isActive && styles.currencyOptionActive,
            ]}
            onPress={() => setUserCurrency(option)}
          >
            <Text
              style={[
                styles.currencyOptionText,
                isActive && styles.currencyOptionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

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
          >
            {item.id === "currency" && renderCurrencySelector()}
          </OnboardingSlide>
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
