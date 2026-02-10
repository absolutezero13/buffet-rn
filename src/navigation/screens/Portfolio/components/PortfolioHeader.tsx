import React from "react";
import { Text } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../../theme";

export function PortfolioHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <LiquidGlassView
      effect="clear"
      style={[styles.header, { paddingTop: top }]}
    >
      <Text style={styles.title}>Portfolio</Text>
      <Text style={styles.subtitle}>Track your investments</Text>
    </LiquidGlassView>
  );
}
