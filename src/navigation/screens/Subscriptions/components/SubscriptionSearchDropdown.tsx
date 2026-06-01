import React, { useMemo, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../theme";
import {
  SUBSCRIPTION_OPTIONS,
  SubscriptionOption,
} from "../subscriptionOptions";

interface SubscriptionSearchDropdownProps {
  selectedValue: SubscriptionOption | null;
  customValue: string;
  onSelect: (subscription: SubscriptionOption | null) => void;
  onCustomValueChange: (value: string) => void;
}

export function SubscriptionSearchDropdown({
  selectedValue,
  customValue,
  onSelect,
  onCustomValueChange,
}: SubscriptionSearchDropdownProps) {
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const trimmedQuery = customValue.trim().toLowerCase();

    if (trimmedQuery.length < 2) {
      return SUBSCRIPTION_OPTIONS.slice(0, 24);
    }

    return SUBSCRIPTION_OPTIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery),
    ).slice(0, 40);
  }, [customValue]);

  const handleSelect = (subscription: SubscriptionOption) => {
    onCustomValueChange(subscription.name);
    setShowResults(false);
    onSelect(subscription);
    Keyboard.dismiss();
  };

  const handleChangeText = (value: string) => {
    onCustomValueChange(value);
    onSelect(null);

    const trimmedQuery = value.trim().toLowerCase();
    if (trimmedQuery.length < 2) {
      setShowResults(true);
      return;
    }

    const filtered = SUBSCRIPTION_OPTIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery),
    );

    setShowResults(filtered.length > 0);
  };

  const handleClear = () => {
    onCustomValueChange("");
    onSelect(null);
    setShowResults(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Subscription</Text>
      <View style={styles.inputContainer}>
        <TextInput
          editable={!selectedValue}
          style={styles.input}
          placeholder="Search or type a custom subscription..."
          placeholderTextColor={theme.colors.textMuted}
          value={customValue}
          onChangeText={handleChangeText}
          onFocus={() => {
            const trimmedQuery = customValue.trim().toLowerCase();
            if (trimmedQuery.length < 2) {
              setShowResults(true);
              return;
            }

            const filtered = SUBSCRIPTION_OPTIONS.filter(
              (item) =>
                item.name.toLowerCase().includes(trimmedQuery) ||
                item.category.toLowerCase().includes(trimmedQuery),
            );
            setShowResults(filtered.length > 0);
          }}
          onBlur={() => {
            setTimeout(() => setShowResults(false), 150);
          }}
          returnKeyType="done"
          onSubmitEditing={() => {
            setShowResults(false);
            Keyboard.dismiss();
          }}
        />

        {customValue.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <MaterialIcons
              name="close"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && !selectedValue && (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.list}
          >
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.resultText}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultCategory}>{item.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {customValue.trim().length >= 2 &&
        !selectedValue &&
        results.length === 0 && (
          <Text style={styles.customHint}>Using custom subscription</Text>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    zIndex: 1000,
    elevation: 1000,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    padding: theme.spacing.md,
  },
  clearButton: {
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  dropdown: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    maxHeight: 240,
    overflow: "hidden",
    zIndex: 9999,
    elevation: 9999,
  },
  list: {
    maxHeight: 240,
  },
  resultItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  resultText: {
    gap: 2,
  },
  resultName: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  resultCategory: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  customHint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});
