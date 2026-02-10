import { createRef, useState } from "react";
import { BottomSheet } from "../../../../components/BottomSheet";
import { currencyOptions } from "../../../constants";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../../../../components";
import useCurrencyStore from "../../../../store/useCurrencyStore";
import { theme } from "../../../../theme";

export const globalCurrencyBottomSheetRef = createRef<TrueSheet>();

const CurrencyBottomSheet = () => {
  const { userCurrency, setUserCurrency } = useCurrencyStore();
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency?.id);

  return (
    <BottomSheet
      ref={globalCurrencyBottomSheetRef}
      title="Select Default Currency"
    >
      <View style={localStyles.optionsContainer}>
        {currencyOptions.map((option) => {
          const isActive = option.id === selectedCurrency;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                localStyles.currencyOption,
                isActive && localStyles.currencyOptionActive,
              ]}
              onPress={() => setSelectedCurrency(option.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  localStyles.symbolContainer,
                  isActive && localStyles.symbolContainerActive,
                ]}
              >
                <Text
                  style={[
                    localStyles.symbol,
                    isActive && localStyles.symbolActive,
                  ]}
                >
                  {option.symbol}
                </Text>
              </View>
              <View style={localStyles.labelContainer}>
                <Text
                  style={[
                    localStyles.currencyCode,
                    isActive && localStyles.currencyCodeActive,
                  ]}
                >
                  {option.id}
                </Text>
                <Text style={localStyles.currencyName}>
                  {option.id === "USD"
                    ? "US Dollar"
                    : option.id === "EUR"
                      ? "Euro"
                      : "British Pound"}
                </Text>
              </View>
              {isActive && (
                <View style={localStyles.checkmark}>
                  <MaterialIcons name="check" size={18} color={theme.colors.background} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        onPress={async () => {
          const currency = currencyOptions.find(
            (option) => option.id === selectedCurrency,
          );
          if (currency) {
            await setUserCurrency(currency);
          }
          globalCurrencyBottomSheetRef.current?.dismiss();
        }}
        title="Confirm"
      />
    </BottomSheet>
  );
};

const localStyles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceLight,
  },
  currencyOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(0, 217, 255, 0.08)",
  },
  symbolContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  symbolContainerActive: {
    backgroundColor: "rgba(0, 217, 255, 0.15)",
  },
  symbol: {
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  symbolActive: {
    color: theme.colors.primary,
  },
  labelContainer: {
    flex: 1,
  },
  currencyCode: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  currencyCodeActive: {
    color: theme.colors.primary,
  },
  currencyName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CurrencyBottomSheet;
