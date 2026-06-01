import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { GlassCard, IconButton } from "../../../../components";
import { CurrencyCode, currencyOptions } from "../../../constants";
import { theme } from "../../../../theme";
import {
  BillingCycle,
  UserSubscription,
} from "../../../../store/useRecurringSubscriptionsStore";

interface SubscriptionCardProps {
  subscription: UserSubscription;
  monthlyAmount: number;
  displayCurrency: CurrencyCode;
  onDelete: () => void;
}

const billingCycleLabels: Record<BillingCycle, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function SubscriptionCard({
  subscription,
  monthlyAmount,
  displayCurrency,
  onDelete,
}: SubscriptionCardProps) {
  const subscriptionSymbol =
    currencyOptions.find((item) => item.id === subscription.currency)?.symbol ??
    "$";
  const displaySymbol =
    currencyOptions.find((item) => item.id === displayCurrency)?.symbol ?? "$";

  const confirmDelete = () => {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete ${subscription.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ],
    );
  };

  return (
    <GlassCard
      tintColor={theme.colors.surfaceLight}
      effect="clear"
      style={cardStyles.container}
    >
      <View style={cardStyles.header}>
        <View style={cardStyles.titleGroup}>
          <Text style={cardStyles.name}>{subscription.name}</Text>
          <Text style={cardStyles.category}>{subscription.category}</Text>
        </View>
        <IconButton
          icon="delete-outline"
          size="xsmall"
          variant="ghost"
          iconColor={theme.colors.dangerLight}
          onPress={confirmDelete}
        />
      </View>

      <View style={cardStyles.details}>
        <View style={cardStyles.detailRow}>
          <Text style={cardStyles.detailLabel}>Price</Text>
          <Text style={cardStyles.detailValue}>
            {subscriptionSymbol}
            {subscription.amount.toFixed(2)}
          </Text>
        </View>
        <View style={cardStyles.detailRow}>
          <Text style={cardStyles.detailLabel}>Billing</Text>
          <Text style={cardStyles.detailValue}>
            {billingCycleLabels[subscription.billingCycle]}
          </Text>
        </View>
      </View>

      <View style={cardStyles.footer}>
        <Text style={cardStyles.totalLabel}>Monthly Impact</Text>
        <Text style={cardStyles.totalValue}>
          {displaySymbol}
          {monthlyAmount.toFixed(2)}
        </Text>
      </View>
    </GlassCard>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  category: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: 2,
  },
  details: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.glassBorder,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  detailValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  totalLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
  },
  totalValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
});
