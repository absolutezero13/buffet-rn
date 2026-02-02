import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { theme } from "../theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  effect?: "clear" | "regular";
  interactive?: boolean;
  tintColor?: string;
}

export function GlassCard({
  children,
  style,
  effect = "clear",
  interactive = false,
  tintColor,
}: GlassCardProps) {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        style={[styles.liquidGlass, style]}
        effect={effect}
        interactive={interactive}
        tintColor={tintColor}
      >
        {children}
      </LiquidGlassView>
    );
  }

  return (
    <View style={[styles.fallbackContainer, style]}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  liquidGlass: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    padding: theme.spacing.md,
  },
  fallbackContainer: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  gradient: {
    flex: 1,
  },
});
