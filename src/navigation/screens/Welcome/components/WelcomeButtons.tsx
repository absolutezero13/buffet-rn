import React from "react";
import { View } from "react-native";
import { Button } from "../../../../components";
import { styles } from "../styles";

interface WelcomeButtonsProps {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeButtons({
  currentIndex,
  totalSlides,
  onNext,
  onSkip,
}: WelcomeButtonsProps) {
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <View style={styles.buttons}>
      <Button
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={onNext}
        fullWidth={isLastSlide}
        style={isLastSlide ? styles.getStartedButton : styles.nextButton}
      />
    </View>
  );
}
