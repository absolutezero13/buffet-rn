import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import useCurrencyStore from "../store/useCurrencyStore";

interface PortfolioSummaryProps {
  totalValue: number;
  totalGainLoss: number;
  assetCount: number;
}

export function PortfolioSummary({
  totalValue,
  totalGainLoss,
  assetCount,
}: PortfolioSummaryProps) {
  const { userCurrency } = useCurrencyStore();
  const isPositive = totalGainLoss >= 0;
  const gainLossPercent =
    totalValue > 0
      ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2)
      : "0.00";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.overlay}>
          <Text style={styles.label}>Portfolio Value</Text>
          <Text style={styles.value}>
            {userCurrency.symbol}
            {totalValue.toFixed(2)}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Gain/Loss</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: isPositive
                      ? theme.colors.secondaryLight
                      : theme.colors.dangerLight,
                  },
                ]}
              >
                {isPositive ? "+" : ""}
                {userCurrency.symbol}
                {totalGainLoss.toFixed(2)} ({isPositive ? "+" : ""}
                {gainLossPercent}%)
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Assets</Text>
              <Text style={styles.statValue}>{assetCount}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
  },
  gradient: {
    padding: 2,
    borderRadius: theme.borderRadius.xl,
  },
  overlay: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl - 2,
    padding: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  value: {
    color: theme.colors.text,
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
});
