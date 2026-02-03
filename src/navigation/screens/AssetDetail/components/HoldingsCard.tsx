import React from "react";
import { View, Text } from "react-native";
import { GlassCard } from "../../../../components";
import { theme } from "../../../../theme";
import { styles } from "../styles";
import useCurrencyStore from "../../../../store/useCurrencyStore";

interface HoldingsCardProps {
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalCost: number;
  totalValue: number;
  gainLoss: number;
  isPositive: boolean;
}

export function HoldingsCard({
  quantity,
  purchasePrice,
  currentPrice,
  totalCost,
  totalValue,
  gainLoss,
  isPositive,
}: HoldingsCardProps) {
  const { userCurrency } = useCurrencyStore();
  const symbol = userCurrency.symbol;

  return (
    <GlassCard style={styles.detailsCard}>
      <Text style={styles.sectionTitle}>Your Holdings</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Quantity</Text>
        <Text style={styles.detailValue}>{quantity}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Average Cost</Text>
        <Text style={styles.detailValue}>
          {symbol}
          {purchasePrice.toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Current Price</Text>
        <Text style={styles.detailValue}>
          {symbol}
          {currentPrice.toFixed(2)}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total Cost</Text>
        <Text style={styles.detailValue}>
          {symbol}
          {totalCost.toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Market Value</Text>
        <Text style={styles.detailValueLarge}>
          {symbol}
          {totalValue.toFixed(2)}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Unrealized P/L</Text>
        <Text
          style={[
            styles.detailValueLarge,
            {
              color: isPositive ? theme.colors.positive : theme.colors.negative,
            },
          ]}
        >
          {isPositive ? "+" : ""}
          {symbol}
          {gainLoss.toFixed(2)}
        </Text>
      </View>
    </GlassCard>
  );
}
