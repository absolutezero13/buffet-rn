import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, TextInput } from "../../../../components";
import { CurrencyCode, currencyOptions } from "../../../constants";
import { BillingCycle } from "../../../../store/useRecurringSubscriptionsStore";
import { styles } from "../styles";
import { SubscriptionSearchDropdown } from "./SubscriptionSearchDropdown";
import { SubscriptionOption } from "../subscriptionOptions";

interface AddSubscriptionFormProps {
  selectedSubscription: SubscriptionOption | null;
  customSubscriptionName: string;
  amount: string;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  onSelectSubscription: (subscription: SubscriptionOption | null) => void;
  onCustomSubscriptionNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: CurrencyCode) => void;
  onBillingCycleChange: (value: BillingCycle) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const billingCycles: Array<{ id: BillingCycle; label: string }> = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export function AddSubscriptionForm({
  selectedSubscription,
  customSubscriptionName,
  amount,
  currency,
  billingCycle,
  onSelectSubscription,
  onCustomSubscriptionNameChange,
  onAmountChange,
  onCurrencyChange,
  onBillingCycleChange,
  onSubmit,
  onClose,
}: AddSubscriptionFormProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.sheetContent}
    >
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Add Subscription</Text>
        <IconButton
          icon="close"
          size="small"
          variant="ghost"
          onPress={onClose}
        />
      </View>

      <View style={styles.sheetBody}>
        <SubscriptionSearchDropdown
          selectedValue={selectedSubscription}
          customValue={customSubscriptionName}
          onSelect={onSelectSubscription}
          onCustomValueChange={onCustomSubscriptionNameChange}
        />

        <TextInput
          label={`Price (${currency})`}
          placeholder="Enter your price"
          value={amount}
          onChangeText={onAmountChange}
          keyboardType="decimal-pad"
        />

        {!keyboardVisible && (
          <>
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Billing Cycle</Text>
              <View style={styles.segmentedOptions}>
                {billingCycles.map((option) => {
                  const isActive = option.id === billingCycle;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.segmentedOption,
                        isActive && styles.segmentedOptionActive,
                      ]}
                      onPress={() => onBillingCycleChange(option.id)}
                    >
                      <Text
                        style={[
                          styles.segmentedOptionText,
                          isActive && styles.segmentedOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Currency</Text>
              <View style={styles.segmentedOptions}>
                {currencyOptions.map((option) => {
                  const isActive = option.id === currency;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.segmentedOption,
                        isActive && styles.segmentedOptionActive,
                      ]}
                      onPress={() => onCurrencyChange(option.id)}
                    >
                      <Text
                        style={[
                          styles.segmentedOptionText,
                          isActive && styles.segmentedOptionTextActive,
                        ]}
                      >
                        {option.id}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        <Button
          title="Add Subscription"
          onPress={onSubmit}
          fullWidth
          style={styles.addButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
