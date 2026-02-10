import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Button } from "../../../components";
import { api } from "../../../services/api";
import {
  AssetHeader,
  PriceChart,
  PriceStats,
  HoldingsCard,
} from "./components";
import { styles } from "./styles";
import { PriceHistoryPoint } from "../../../services/types";
import useUserAssets from "../../../store/useUserAssets";
import { assetApi } from "../../../services/assetApi";
import { useCurrency } from "../../../hooks";

type RouteParams = {
  AssetDetail: {
    assetId: string;
  };
};

const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

export function AssetDetail() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "AssetDetail">>();
  const { userAssets: assets } = useUserAssets();
  const {
    toUserCurrency,
    getAssetCurrentValue,
    getAssetTotalCost,
    getAssetGainLoss,
    getAssetPurchasePrice,
    getAssetCurrentPrice,
  } = useCurrency();
  const [selectedRange, setSelectedRange] = useState(1);
  const [chartData, setChartData] = useState<
    { value: number; label: string; date: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<{
    price: number;
    date: string;
  } | null>(null);
  const [priceChange, setPriceChange] = useState<{
    amount: number;
    percent: number;
  } | null>(null);

  const asset = assets.find((a) => a.id === route.params?.assetId);

  const generateFallbackData = useCallback(() => {
    if (!asset) return;

    const currentPriceInUserCurrency = getAssetCurrentPrice(asset);
    const days = timeRanges[selectedRange].days;
    const data = [];
    let price = currentPriceInUserCurrency * (0.85 + Math.random() * 0.15);

    for (let i = days; i >= 0; i--) {
      const change =
        (Math.random() - 0.48) * (currentPriceInUserCurrency * 0.03);
      price = Math.max(price + change, currentPriceInUserCurrency * 0.5);
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        value: price,
        label:
          i % Math.ceil(days / 5) === 0
            ? date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "",
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    data[data.length - 1].value = currentPriceInUserCurrency;

    const firstPrice = data[0].value;
    const lastPrice = data[data.length - 1].value;
    setPriceChange({
      amount: lastPrice - firstPrice,
      percent: ((lastPrice - firstPrice) / firstPrice) * 100,
    });

    setChartData(data);
  }, [asset, selectedRange, getAssetCurrentPrice]);

  const fetchPriceHistory = useCallback(async () => {
    if (!asset) return;

    setSelectedPoint(null);

    try {
      let history: PriceHistoryPoint[] = [];
      const days = timeRanges[selectedRange].days;
      console.log("Fetching history for", asset, "for", days, "days");
      if (asset.type === "crypto" && asset.symbol) {
        history = await api.getCryptoHistory(asset.symbol, days);
      } else if (asset.type === "stock" || asset.type === "etf") {
        history = await api.getStockHistory(asset.symbol, days);
      } else if (asset.type === "gold") {
        history = await api.getCommodityHistory(asset.symbol, days);
        console.log("Fetched gold history:", history);
      } else if (asset.type === "cash") {
        history = [];
      }

      if (history.length > 0) {
        // Convert prices from USD to user currency
        const firstPrice = toUserCurrency(history[0].price);
        const lastPrice = toUserCurrency(history[history.length - 1].price);
        const changeAmount = lastPrice - firstPrice;
        const changePercent = (changeAmount / firstPrice) * 100;
        setPriceChange({ amount: changeAmount, percent: changePercent });

        const maxPoints = 50;
        const step = Math.ceil(history.length / maxPoints);
        const sampledHistory = history.filter(
          (_, i) => i % step === 0 || i === history.length - 1,
        );

        const formattedData = sampledHistory.map((point, index) => ({
          value: toUserCurrency(point.price),
          label:
            index % Math.ceil(sampledHistory.length / 5) === 0
              ? point.date
              : "",
          date: point.date,
        }));

        setChartData(formattedData);
      } else {
        Alert.alert(
          "No Data",
          "Price history data is not available for this asset.",
        );
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
      generateFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, [asset, selectedRange, generateFallbackData, toUserCurrency]);

  useEffect(() => {
    fetchPriceHistory();
  }, [fetchPriceHistory]);

  const getTypeLabel = () => {
    if (!asset) return "";
    switch (asset.type) {
      case "stock":
        return "📈 Stock";
      case "etf":
        return "📊 ETF";
      case "crypto":
        return "🪙 Crypto";
      case "gold":
        return "🥇 Gold";
      case "cash":
        return "💵 Cash";
      default:
        return "💎 Other";
    }
  };

  const handleDelete = () => {
    if (!asset) return;
    Alert.alert(
      "Delete Asset",
      `Are you sure you want to delete ${asset.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            assetApi.deletAsset(asset.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!asset) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Asset not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const totalValue = asset ? getAssetCurrentValue(asset) : 0;
  const totalCost = asset ? getAssetTotalCost(asset) : 0;
  const { gainLoss, isPositive } = asset
    ? getAssetGainLoss(asset)
    : { gainLoss: 0, isPositive: true };
  const purchasePriceDisplay = asset ? getAssetPurchasePrice(asset) : 0;
  const currentPriceDisplay = asset ? getAssetCurrentPrice(asset) : 0;
  const isPriceChangePositive = priceChange
    ? priceChange.amount >= 0
    : isPositive;

  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;

  return (
    <>
      <AssetHeader
        symbol={asset.symbol}
        typeLabel={getTypeLabel()}
        onBack={() => navigation.goBack()}
        onDelete={handleDelete}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <PriceChart
            chartData={chartData}
            isLoading={isLoading}
            selectedRange={selectedRange}
            timeRanges={timeRanges}
            isPriceChangePositive={isPriceChangePositive}
            assetName={asset.name}
            currentPrice={currentPriceDisplay}
            selectedPoint={selectedPoint}
            onRangeChange={setSelectedRange}
            onRetry={fetchPriceHistory}
          />

          <PriceStats
            maxValue={maxValue}
            minValue={minValue}
            currentPrice={currentPriceDisplay}
          />

          <HoldingsCard
            quantity={asset.quantity}
            purchasePrice={purchasePriceDisplay}
            currentPrice={currentPriceDisplay}
            totalCost={totalCost}
            totalValue={totalValue}
            gainLoss={gainLoss}
            isPositive={isPositive}
          />

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </>
  );
}
