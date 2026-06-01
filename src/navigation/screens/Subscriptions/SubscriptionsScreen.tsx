import React, { useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Button, GlassCard, IconButton, TabHeader } from "../../../components";
import { CurrencyCode } from "../../constants";
import { theme } from "../../../theme";
import useCurrencyStore from "../../../store/useCurrencyStore";
import useRecurringSubscriptionsStore, {
  BillingCycle,
  UserSubscription,
} from "../../../store/useRecurringSubscriptionsStore";
import { subscriptionApi } from "../../../services/subscriptionApi";
import { SubscriptionOption } from "./subscriptionOptions";
import {
  AddSubscriptionForm,
  SubscriptionCard,
  SubscriptionsSummary,
} from "./components";
import { styles } from "./styles";

function getMonthlyAmount(subscription: UserSubscription) {
  if (subscription.billingCycle === "weekly") {
    return (subscription.amount * 52) / 12;
  }

  if (subscription.billingCycle === "yearly") {
    return subscription.amount / 12;
  }

  return subscription.amount;
}

export function Subscriptions() {
  const sheetRef = useRef<TrueSheet>(null);
  const { userCurrency, convertBetweenCurrencies } = useCurrencyStore();
  const { subscriptions } = useRecurringSubscriptionsStore();
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionOption | null>(null);
  const [customSubscriptionName, setCustomSubscriptionName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(
    userCurrency?.id || "USD",
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const resetForm = () => {
    setSelectedSubscription(null);
    setCustomSubscriptionName("");
    setAmount("");
    setCurrency(userCurrency?.id || "USD");
    setBillingCycle("monthly");
  };

  const openAddSheet = () => {
    sheetRef.current?.present();
  };

  const handleCloseSheet = () => {
    resetForm();
    sheetRef.current?.dismiss();
  };

  const handleAddSubscription = async () => {
    const parsedAmount = parseFloat(amount);
    const trimmedCustomName = customSubscriptionName.trim();
    const subscriptionName = selectedSubscription?.name ?? trimmedCustomName;

    if (!subscriptionName || !amount || Number.isNaN(parsedAmount)) {
      Alert.alert("Missing Fields", "Please enter a subscription and price");
      return;
    }

    if (parsedAmount <= 0) {
      Alert.alert("Invalid Price", "Please enter a price greater than zero");
      return;
    }

    resetForm();
    sheetRef.current?.dismiss();

    const customServiceId = subscriptionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const serviceId =
      selectedSubscription?.id ??
      `custom-${customServiceId || Date.now().toString()}`;

    await subscriptionApi.addSubscription({
      serviceId,
      name: subscriptionName,
      category: selectedSubscription?.category ?? "Custom",
      amount: parsedAmount,
      currency,
      billingCycle,
    });
  };

  const getDisplayMonthlyAmount = (subscription: UserSubscription) => {
    const monthlyAmount = getMonthlyAmount(subscription);
    return convertBetweenCurrencies(
      monthlyAmount,
      subscription.currency,
      userCurrency.id,
    );
  };

  const monthlyTotal = subscriptions.reduce(
    (sum, item) => sum + getDisplayMonthlyAmount(item),
    0,
  );

  return (
    <>
      <TabHeader title="Subscriptions" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <SubscriptionsSummary
            monthlyTotal={monthlyTotal}
            subscriptionCount={subscriptions.length}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Subscriptions</Text>
            <IconButton
              icon="add"
              size="small"
              variant="primary"
              onPress={openAddSheet}
            />
          </View>

          {subscriptions.length === 0 ? (
            <GlassCard
              tintColor={theme.colors.surfaceLight}
              effect="clear"
              style={styles.emptyCard}
            >
              <Text style={styles.emptyTitle}>No subscriptions yet</Text>
              <Text style={styles.emptyText}>
                Add recurring services to see your monthly total.
              </Text>
              <Button title="Add Subscription" onPress={openAddSheet} />
            </GlassCard>
          ) : (
            subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                monthlyAmount={getDisplayMonthlyAmount(subscription)}
                displayCurrency={userCurrency.id}
                onDelete={() =>
                  subscriptionApi.deleteSubscription(subscription.id)
                }
              />
            ))
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      <TrueSheet
        ref={sheetRef}
        detents={["auto"]}
        cornerRadius={24}
        onDidDismiss={resetForm}
        backgroundColor={theme.colors.surface}
        insetAdjustment="never"
        blurOptions={{
          interaction: false,
        }}
      >
        <AddSubscriptionForm
          selectedSubscription={selectedSubscription}
          customSubscriptionName={customSubscriptionName}
          amount={amount}
          currency={currency}
          billingCycle={billingCycle}
          onSelectSubscription={setSelectedSubscription}
          onCustomSubscriptionNameChange={setCustomSubscriptionName}
          onAmountChange={setAmount}
          onCurrencyChange={setCurrency}
          onBillingCycleChange={setBillingCycle}
          onSubmit={handleAddSubscription}
          onClose={handleCloseSheet}
        />
      </TrueSheet>
    </>
  );
}
