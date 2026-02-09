import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../theme";
import { styles } from "./styles";

const LOADING_STEPS = [
  { emoji: "📊", text: "Analyzing markets..." },
  { emoji: "🤖", text: "Preparing AI insights..." },
  { emoji: "💼", text: "Setting up your portfolio..." },
  { emoji: "✨", text: "Almost ready..." },
];

const STEP_DURATION = 800;

interface LoadingScreenProps {
  onComplete: () => void;
}

export function Loading({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, STEP_DURATION);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION);

    return () => clearInterval(timer);
  }, [onComplete]);

  const step = LOADING_STEPS[stepIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Text style={styles.emoji}>{step.emoji}</Text>
        <Text style={styles.stepText}>{step.text}</Text>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.spinner}
        />
      </View>

      <View style={styles.progressContainer}>
        {LOADING_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= stepIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
