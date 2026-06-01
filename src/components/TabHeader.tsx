import React from "react";
import { Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { theme } from "../theme";

export const TAB_HEADER_HEIGHT = 92;

interface TabHeaderProps {
  title: string;
}

export function TabHeader({ title }: TabHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <LiquidGlassView
      effect="clear"
      style={[styles.header, { paddingTop: top }]}
    >
      <Text style={styles.title}>{title}</Text>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    position: "absolute",
    width: "100%",
    zIndex: 10,
    borderBottomEndRadius: theme.borderRadius.xl,
    borderBottomStartRadius: theme.borderRadius.xl,
    top: 0,
    height: TAB_HEADER_HEIGHT,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
});
