import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../theme";
import { styles } from "./styles";

const LOADING_STEPS = [
  { emoji: "📊", text: "Analyzing markets..." },
  { emoji: "🤖", text: "Preparing AI insights..." },
  { emoji: "💼", text: "Setting up your portfolio..." },
  { emoji: "✨", text: "Almost ready..." },
];

const STEP_DURATION = 1500;

export function Loading() {
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useState(() => new Animated.Value(1))[0];
  const slideAnim = useState(() => new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            navigation.navigate("Paywall" as never);
          }, STEP_DURATION);
          return prev;
        }

        // Animate out
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Reset position and animate in
          slideAnim.setValue(30);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });

        return prev + 1;
      });
    }, STEP_DURATION);

    return () => clearInterval(timer);
  }, [navigation, fadeAnim, slideAnim]);

  const step = LOADING_STEPS[stepIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {step.emoji}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.stepText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {step.text}
        </Animated.Text>
        <Animated.View style={[styles.spinner, { opacity: fadeAnim }]}>
          <View style={styles.spinnerDot} />
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        {LOADING_STEPS.map((_, index) => (
          <Animated.View
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
