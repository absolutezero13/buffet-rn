import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import {
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { theme } from "../theme";

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

export function GlassContainer({
  children,
  style,
  spacing = 20,
}: GlassContainerProps) {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassContainerView spacing={spacing} style={style}>
        {children}
      </LiquidGlassContainerView>
    );
  }

  return <View style={[styles.fallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fallback: {
    gap: theme.spacing.md,
  },
});
