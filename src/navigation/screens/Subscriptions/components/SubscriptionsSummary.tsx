import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../theme";
import useCurrencyStore from "../../../../store/useCurrencyStore";

interface SubscriptionsSummaryProps {
  monthlyTotal: number;
  subscriptionCount: number;
}

export function SubscriptionsSummary({
  monthlyTotal,
  subscriptionCount,
}: SubscriptionsSummaryProps) {
  const { userCurrency } = useCurrencyStore();

  return (
    <View style={summaryStyles.container}>
      <LinearGradient
        colors={[theme.colors.secondary, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={summaryStyles.gradient}
      >
        <View style={summaryStyles.overlay}>
          <Text style={summaryStyles.label}>Monthly Recurring Total</Text>
          <Text style={summaryStyles.value}>
            {userCurrency.symbol}
            {monthlyTotal.toFixed(2)}
          </Text>
          <View style={summaryStyles.statsRow}>
            <View>
              <Text style={summaryStyles.statLabel}>Subscriptions</Text>
              <Text style={summaryStyles.statValue}>{subscriptionCount}</Text>
            </View>
            <View style={summaryStyles.rightStat}>
              <Text style={summaryStyles.statLabel}>Annualized</Text>
              <Text style={summaryStyles.statValue}>
                {userCurrency.symbol}
                {(monthlyTotal * 12).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
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
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightStat: {
    alignItems: "flex-end",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    marginTop: theme.spacing.xs,
  },
});
