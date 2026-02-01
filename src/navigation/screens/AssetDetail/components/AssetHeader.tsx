import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";

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
  return (
    <View style={styles.header}>
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
    </View>
  );
}
