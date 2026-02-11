import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  Button,
  IconButton,
  TextInput,
  TypeSelector,
  AssetSearchDropdown,
  SearchResult,
} from "../../../../components";
import { styles } from "../styles";
import { currencyOptions } from "../../../constants";
import { AssetType } from "../../../../services/types";

interface AddAssetFormProps {
  selectedAsset: SearchResult | null;
  type: AssetType;
  quantity: string;
  purchasePrice: string;
  baseCurrency: "USD" | "EUR" | "GBP";
  cashCurrency: "USD" | "EUR" | "GBP";
  onSelectAsset: (asset: SearchResult | null) => void;
  onTypeChange: (type: string) => void;
  onQuantityChange: (value: string) => void;
  onPurchasePriceChange: (value: string) => void;
  onCashCurrencyChange: (value: "USD" | "EUR" | "GBP") => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddAssetForm({
  selectedAsset,
  type,
  quantity,
  purchasePrice,
  baseCurrency,
  cashCurrency,
  onSelectAsset,
  onTypeChange,
  onQuantityChange,
  onPurchasePriceChange,
  onCashCurrencyChange,
  onSubmit,
  onClose,
}: AddAssetFormProps) {
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
        <Text style={styles.sheetTitle}>Add Asset</Text>
        <IconButton
          icon="close"
          size="small"
          variant="ghost"
          onPress={onClose}
        />
      </View>

      <View style={styles.sheetBody}>
        {!keyboardVisible && (
          <TypeSelector
            selected={type}
            onSelect={(t) => {
              onTypeChange(t);
              onSelectAsset(null);
            }}
          />
        )}

        {type === "cash" ? (
          <View style={styles.currencySelector}>
            <Text style={styles.currencyLabel}>Currency</Text>
            <View style={styles.currencyOptions}>
              {currencyOptions.map((option) => {
                const isActive = option.id === cashCurrency;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.currencyOption,
                      isActive && styles.currencyOptionActive,
                    ]}
                    onPress={() => {
                      onCashCurrencyChange(option.id);
                      onSelectAsset({
                        symbol: option.id,
                        name: `Cash (${option.id})`,
                      });
                    }}
                  >
                    <Text
                      style={[
                        styles.currencyOptionText,
                        isActive && styles.currencyOptionTextActive,
                      ]}
                    >
                      {option.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.dropdownContainer}>
            <AssetSearchDropdown
              assetType={type}
              onSelect={onSelectAsset}
              selectedValue={selectedAsset}
              placeholder={
                type === "crypto"
                  ? "Search cryptocurrency..."
                  : type === "gold"
                    ? "Search commodities..."
                    : "Search stocks & ETFs..."
              }
            />
          </View>
        )}

        <TextInput
          label={type === "cash" ? `Amount (${cashCurrency})` : "Quantity"}
          placeholder={type === "cash" ? `e.g., 100` : "e.g., 10"}
          value={quantity}
          onChangeText={onQuantityChange}
          keyboardType="decimal-pad"
        />

        {type !== "cash" && (
          <TextInput
            label={`Purchase Price (${baseCurrency})`}
            placeholder="e.g., 150.00"
            value={purchasePrice}
            onChangeText={onPurchasePriceChange}
            keyboardType="decimal-pad"
          />
        )}

        <Button
          title="Add Asset"
          onPress={onSubmit}
          fullWidth
          style={styles.addButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
