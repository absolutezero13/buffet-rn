import React from "react";
import { View, Animated, Dimensions } from "react-native";
import { theme } from "../../../../theme";
import { styles } from "../styles";

const { width } = Dimensions.get("window");

interface PaginationDotsProps {
  slides: any[];
  scrollX: Animated.Value;
}

export function PaginationDots({ slides, scrollX }: PaginationDotsProps) {
  return (
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
  );
}
