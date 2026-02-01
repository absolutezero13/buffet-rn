import React from "react";
import { View, Text } from "react-native";
import { GlassCard } from "../../../../components";
import { styles } from "../styles";

interface PriceStatsProps {
  maxValue: number;
  minValue: number;
  currentPrice: number;
}

export function PriceStats({
  maxValue,
  minValue,
  currentPrice,
}: PriceStatsProps) {
  return (
    <GlassCard style={styles.statsCard}>
      <Text style={styles.sectionTitle}>Price Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>${maxValue.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>${minValue.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>${currentPrice.toFixed(2)}</Text>
        </View>
      </View>
    </GlassCard>
  );
}
