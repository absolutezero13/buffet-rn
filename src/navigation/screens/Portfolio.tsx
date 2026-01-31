import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { theme } from "../../theme";
import { useApp } from "../../context/AppContext";
import {
  GlassCard,
  Button,
  TextInput,
  AssetCard,
  PortfolioSummary,
  TypeSelector,
  AssetSearchDropdown,
  SearchResult,
} from "../../components";

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
        >
          <View style={styles.header}>
            <Text style={styles.title}>Portfolio</Text>
            <Text style={styles.subtitle}>Track your investments</Text>
          </View>

          <PortfolioSummary
            totalValue={totalValue}
            totalGainLoss={totalGainLoss}
            assetCount={assets.length}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            <View style={styles.headerButtons}>
              {assets.length > 0 && (
                <Button
                  title={isRefreshing ? "⟳" : "↻"}
                  size="small"
                  variant="secondary"
                  onPress={handleRefresh}
                  style={styles.refreshButton}
                />
              )}
              <Button title="+ Add" size="small" onPress={openAddSheet} />
            </View>
          </View>

          {assets.length === 0 ? (
            <GlassCard effect="regular" style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>No Assets Yet</Text>
              <Text style={styles.emptyText}>
                Start building your portfolio by adding your first asset
              </Text>
              <Button
                title="Add Your First Asset"
                onPress={openAddSheet}
                style={styles.emptyButton}
              />
            </GlassCard>
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
        backgroundColor={theme.colors.surface}
        blurTint="system-thick-material-light"
        insetAdjustment="never"
        blurOptions={{
          interaction: false,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.sheetContent}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Add Asset</Text>
            <Button
              title="✕"
              variant="ghost"
              size="small"
              onPress={() => {
                resetForm();
                sheetRef.current?.dismiss();
              }}
            />
          </View>

          <View style={styles.sheetBody}>
            <TypeSelector
              selected={type}
              onSelect={(t) => {
                setType(t);
                setSelectedAsset(null);
              }}
            />

            <View style={styles.dropdownContainer}>
              <AssetSearchDropdown
                assetType={type}
                onSelect={setSelectedAsset}
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
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />

            <TextInput
              label="Purchase Price ($)"
              placeholder="e.g., 150.00"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              keyboardType="decimal-pad"
            />

            <Button
              title="Add Asset"
              onPress={handleAddAsset}
              fullWidth
              style={styles.addButton}
            />
          </View>
        </KeyboardAvoidingView>
      </TrueSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  refreshButton: {
    minWidth: 44,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    marginTop: theme.spacing.md,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
  sheetContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sheetTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  sheetBody: {
    flex: 1,
  },
  dropdownContainer: {
    zIndex: 100,
    elevation: 100,
  },
  addButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
