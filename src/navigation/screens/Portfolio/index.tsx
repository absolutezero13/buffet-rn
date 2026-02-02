import React, { useState, useRef } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { AssetCard, PortfolioSummary, SearchResult } from "../../../components";
import {
  PortfolioHeader,
  EmptyPortfolio,
  AssetsSectionHeader,
  AddAssetForm,
} from "./components";
import { styles } from "./styles";
import { theme } from "../../../theme";
import { CurrencyCode } from "../../constants";
import { assetApi } from "../../../services/assetApi";
import useUserStore from "../../../store/useUserStore";
import useUserAssets from "../../../store/useUserAssets";

export function Portfolio() {
  const { userAssets: assets } = useUserAssets();
  const { userCurrency } = useUserStore();
  const sheetRef = useRef<TrueSheet>(null);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);
  const [type, setType] = useState("stock");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [cashCurrency, setCashCurrency] = useState<CurrencyCode>(
    userCurrency?.id || "USD",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // await refreshPrices();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setSelectedAsset(null);
    setType("stock");
    setQuantity("");
    setPurchasePrice("");
    setCashCurrency(userCurrency?.id || "USD");
  };

  const handleAddAsset = () => {
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

    assetApi.addAsset({
      name: assetName,
      symbol:
        type === "crypto" ? (selectedAsset?.id ?? "unknows") : assetSymbol,
      type: type as "stock" | "etf" | "crypto" | "gold" | "cash" | "other",
      quantity: parseFloat(quantity),
      purchasePrice: isCash ? 1 : parseFloat(purchasePrice),
      purchaseCurrency: userCurrency?.id || "USD",
    });

    resetForm();
    sheetRef.current?.dismiss();
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

  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.currentPrice * asset.quantity,
    0,
  );
  const totalGainLoss = assets.reduce((sum, asset) => {
    const totalCost = asset.purchasePrice * asset.quantity;
    const totalCurrentValue = asset.currentPrice * asset.quantity;
    return sum + (totalCurrentValue - totalCost);
  }, 0);

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <PortfolioHeader />

          <PortfolioSummary
            totalValue={totalValue}
            totalGainLoss={totalGainLoss}
            assetCount={assets.length}
          />

          <AssetsSectionHeader
            hasAssets={assets.length > 0}
            isRefreshing={isRefreshing}
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
      </SafeAreaView>

      <TrueSheet
        ref={sheetRef}
        detents={["auto"]}
        cornerRadius={24}
        onDidDismiss={resetForm}
        backgroundColor={theme.colors.background}
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
