import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../../../../components";
import { theme } from "../../../../theme";

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
      <IconButton icon="arrow-back" size="medium" variant="ghost" onPress={onBack} />
      <View style={styles.headerCenter}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.type}>{typeLabel}</Text>
      </View>
      <IconButton icon="delete-outline" size="medium" variant="ghost" onPress={onDelete} iconColor={theme.colors.danger} />
    </LiquidGlassView>
  );
}
