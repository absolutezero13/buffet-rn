import React from "react";
import { View, Text } from "react-native";
import { GlassCard } from "../../../../components";
import { styles } from "../styles";
import useCurrencyStore from "../../../../store/useCurrencyStore";

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
  const { userCurrency } = useCurrencyStore();
  const symbol = userCurrency.symbol;

  return (
    <GlassCard style={styles.statsCard}>
      <Text style={styles.sectionTitle}>Price Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>
            {symbol}
            {maxValue.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>
            {symbol}
            {minValue.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>
            {symbol}
            {currentPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}
