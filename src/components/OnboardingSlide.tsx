import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

interface OnboardingSlideProps {
  asset: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function OnboardingSlide({
  asset,
  title,
  description,
  children,
}: OnboardingSlideProps) {
  return (
    <View style={styles.slide}>
      <LinearGradient
        colors={["rgba(99, 102, 241, 0.2)", "transparent"]}
        style={styles.glow}
      />
      <Image source={asset} style={styles.asset} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children && <View style={styles.customContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  asset: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.xl,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: height * 0.15,
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  customContent: {
    marginTop: theme.spacing.xxl,
    width: "100%",
    alignItems: "center",
  },
});
