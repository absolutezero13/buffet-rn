import React, { useState, useRef } from "react";
import { View, ScrollView, Alert } from "react-native";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import {
  AssetCard,
  PortfolioSummary,
  SearchResult,
  BisonLoader,
} from "../../../components";
import {
  PortfolioHeader,
  EmptyPortfolio,
  AssetsSectionHeader,
  AddAssetForm,
} from "./components";
import { styles } from "./styles";
import { theme } from "../../../theme";
import { CurrencyCode, TROY_OUNCE_TO_GRAM } from "../../constants";
import { assetApi } from "../../../services/assetApi";
import useCurrencyStore from "../../../store/useCurrencyStore";
import useWeightUnitStore from "../../../store/useWeightUnitStore";
import useUserAssets from "../../../store/useUserAssets";
import { useCurrency } from "../../../hooks";
import { AssetType } from "../../../services/types";

export function Portfolio() {
  const { userAssets: assets, isLoading } = useUserAssets();
  const { userCurrency } = useCurrencyStore();
  const { weightUnit } = useWeightUnitStore();
  const { getAssetCurrentValue, getAssetTotalCost } = useCurrency();

  const sheetRef = useRef<TrueSheet>(null);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);
  const [type, setType] = useState<AssetType>("stock");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [cashCurrency, setCashCurrency] = useState<CurrencyCode>(
    userCurrency?.id || "USD",
  );
  const handleRefresh = async () => {
    await assetApi.refreshPrices();
  };

  const resetForm = () => {
    setSelectedAsset(null);
    setType("stock");
    setQuantity("");
    setPurchasePrice("");
    setCashCurrency(userCurrency?.id || "USD");
  };

  const handleAddAsset = async () => {
    if (type === "cash") {
      if (!quantity) {
        Alert.alert("Missing Fields", "Please enter a cash amount");
        return;
      }
    } else if (!selectedAsset?.symbol || !quantity || !purchasePrice) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    const isCash = type === "cash";
    const assetSymbol = isCash ? cashCurrency : selectedAsset?.symbol || "";
    const assetName = isCash
      ? `Cash (${cashCurrency})`
      : selectedAsset?.name || "";

    // For commodities, convert quantity from user's weight unit to ounces for storage
    // Also convert purchase price from per-gram to per-ounce if user is in gram mode
    let finalQuantity = parseFloat(quantity);
    let finalPurchasePrice = isCash ? 1 : parseFloat(purchasePrice);

    if (type === "gold" && weightUnit.id === "GRAM") {
      // Convert grams to ounces (stored quantity is always in ounces)
      finalQuantity = finalQuantity / TROY_OUNCE_TO_GRAM;
      // Convert price per gram to price per ounce
      finalPurchasePrice = finalPurchasePrice * TROY_OUNCE_TO_GRAM;
    }

    resetForm();
    sheetRef.current?.dismiss();

    await assetApi.addAsset({
      name: assetName,
      symbol:
        type === "crypto" ? (selectedAsset?.id ?? "unknown") : assetSymbol,
      type: type as "stock" | "etf" | "crypto" | "gold" | "cash" | "other",
      quantity: finalQuantity,
      purchasePrice: finalPurchasePrice,
      purchaseCurrency: userCurrency?.id || "USD",
    });
  };

  const openAddSheet = () => {
    sheetRef.current?.present();
  };

  const handleCloseSheet = () => {
    resetForm();
    sheetRef.current?.dismiss();
  };

  const handleDeleteAsset = (id: string, name: string) => {
    Alert.alert("Delete Asset", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => assetApi.deletAsset(id),
      },
    ]);
  };

  // Calculate totals in user's currency
  const totalValue = assets.reduce(
    (sum, asset) => sum + getAssetCurrentValue(asset),
    0,
  );
  const totalGainLoss = assets.reduce((sum, asset) => {
    const currentValue = getAssetCurrentValue(asset);
    const totalCost = getAssetTotalCost(asset);
    return sum + (currentValue - totalCost);
  }, 0);

  return (
    <>
      <PortfolioHeader />
      {isLoading && <BisonLoader />}

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <PortfolioSummary
            totalValue={totalValue}
            totalGainLoss={totalGainLoss}
            assetCount={assets.length}
          />

          <AssetsSectionHeader
            hasAssets={assets.length > 0}
            isRefreshing={isLoading}
            onRefresh={handleRefresh}
            onAddAsset={openAddSheet}
          />

          {assets.length === 0 ? (
            <EmptyPortfolio onAddAsset={openAddSheet} />
          ) : (
            assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDelete={() => handleDeleteAsset(asset.id, asset.name)}
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
        <AddAssetForm
          selectedAsset={selectedAsset}
          type={type}
          quantity={quantity}
          purchasePrice={purchasePrice}
          baseCurrency={userCurrency?.id || "USD"}
          cashCurrency={cashCurrency}
          onSelectAsset={setSelectedAsset}
          onTypeChange={setType}
          onQuantityChange={setQuantity}
          onPurchasePriceChange={setPurchasePrice}
          onCashCurrencyChange={setCashCurrency}
          onSubmit={handleAddAsset}
          onClose={handleCloseSheet}
        />
      </TrueSheet>
    </>
  );
}
