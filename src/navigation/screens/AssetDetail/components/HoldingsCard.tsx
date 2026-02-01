import React from "react";
import { View, Text } from "react-native";
import { GlassCard } from "../../../../components";
import { theme } from "../../../../theme";
import { styles } from "../styles";

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
  return (
    <GlassCard style={styles.detailsCard}>
      <Text style={styles.sectionTitle}>Your Holdings</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Quantity</Text>
        <Text style={styles.detailValue}>{quantity}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Average Cost</Text>
        <Text style={styles.detailValue}>${purchasePrice.toFixed(2)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Current Price</Text>
        <Text style={styles.detailValue}>${currentPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total Cost</Text>
        <Text style={styles.detailValue}>${totalCost.toFixed(2)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Market Value</Text>
        <Text style={styles.detailValueLarge}>${totalValue.toFixed(2)}</Text>
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
          {isPositive ? "+" : ""}${gainLoss.toFixed(2)}
        </Text>
      </View>
    </GlassCard>
  );
}
