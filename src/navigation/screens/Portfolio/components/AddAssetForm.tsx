import React from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  TextInput,
  TypeSelector,
  AssetSearchDropdown,
  SearchResult,
} from "../../../../components";
import { styles } from "../styles";

interface AddAssetFormProps {
  selectedAsset: SearchResult | null;
  type: string;
  quantity: string;
  purchasePrice: string;
  onSelectAsset: (asset: SearchResult | null) => void;
  onTypeChange: (type: string) => void;
  onQuantityChange: (value: string) => void;
  onPurchasePriceChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddAssetForm({
  selectedAsset,
  type,
  quantity,
  purchasePrice,
  onSelectAsset,
  onTypeChange,
  onQuantityChange,
  onPurchasePriceChange,
  onSubmit,
  onClose,
}: AddAssetFormProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.sheetContent}
    >
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Add Asset</Text>
        <Button title="✕" variant="ghost" size="small" onPress={onClose} />
      </View>

      <View style={styles.sheetBody}>
        <TypeSelector
          selected={type}
          onSelect={(t) => {
            onTypeChange(t);
            onSelectAsset(null);
          }}
        />

        <View style={styles.dropdownContainer}>
          <AssetSearchDropdown
            assetType={type}
            onSelect={onSelectAsset}
            selectedValue={selectedAsset}
            placeholder={
              type === "crypto"
                ? "Search cryptocurrency..."
                : type === "gold"
                  ? "Search gold assets..."
                  : "Search stocks & ETFs..."
            }
          />
        </View>

        <TextInput
          label="Quantity"
          placeholder="e.g., 10"
          value={quantity}
          onChangeText={onQuantityChange}
          keyboardType="decimal-pad"
        />

        <TextInput
          label="Purchase Price ($)"
          placeholder="e.g., 150.00"
          value={purchasePrice}
          onChangeText={onPurchasePriceChange}
          keyboardType="decimal-pad"
        />

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
