import React, { useState, useRef } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useApp } from "../../../context/AppContext";
import { AssetCard, PortfolioSummary, SearchResult } from "../../../components";
import {
  PortfolioHeader,
  EmptyPortfolio,
  AssetsSectionHeader,
  AddAssetForm,
} from "./components";
import { styles } from "./styles";
import { theme } from "../../../theme";

export function Portfolio() {
  const {
    assets,
    addAsset,
    deleteAsset,
    totalValue,
    totalGainLoss,
    refreshPrices,
  } = useApp();
  const sheetRef = useRef<TrueSheet>(null);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);
  const [type, setType] = useState("stock");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPrices();
    setIsRefreshing(false);
  };

  const resetForm = () => {
    setSelectedAsset(null);
    setType("stock");
    setQuantity("");
    setPurchasePrice("");
  };

  const handleAddAsset = () => {
    if (!selectedAsset?.symbol || !quantity || !purchasePrice) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    addAsset({
      name: selectedAsset.name,
      symbol: selectedAsset.symbol,
      type: type as "stock" | "etf" | "crypto" | "gold" | "other",
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      cryptoId: selectedAsset.id,
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
      { text: "Delete", style: "destructive", onPress: () => deleteAsset(id) },
    ]);
  };

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
          onSelectAsset={setSelectedAsset}
          onTypeChange={setType}
          onQuantityChange={setQuantity}
          onPurchasePriceChange={setPurchasePrice}
          onSubmit={handleAddAsset}
          onClose={handleCloseSheet}
        />
      </TrueSheet>
    </>
  );
}
