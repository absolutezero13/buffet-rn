import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AssetHeaderProps {
  symbol: string;
  typeLabel: string;
  onBack: () => void;
  onDelete: () => void;
}

export function AssetHeader({
  symbol,
  typeLabel,
  onBack,
  onDelete,
}: AssetHeaderProps) {
  const { top } = useSafeAreaInsets();
  return (
    <LiquidGlassView
      effect="clear"
      style={[styles.header, { paddingTop: top }]}
    >
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.type}>{typeLabel}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </LiquidGlassView>
  );
}
