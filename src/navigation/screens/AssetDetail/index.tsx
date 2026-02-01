import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useApp } from "../../../context/AppContext";
import { Button } from "../../../components";
import { api, PriceHistoryPoint } from "../../../services/api";
import {
  AssetHeader,
  PriceChart,
  PriceStats,
  HoldingsCard,
} from "./components";
import { styles } from "./styles";

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
  const { assets, deleteAsset } = useApp();
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
  console.log("Selected asset:", asset);
  const generateFallbackData = useCallback(() => {
    if (!asset) return;

    const days = timeRanges[selectedRange].days;
    const data = [];
    let price = asset.currentPrice * (0.85 + Math.random() * 0.15);

    for (let i = days; i >= 0; i--) {
      const change = (Math.random() - 0.48) * (asset.currentPrice * 0.03);
      price = Math.max(price + change, asset.currentPrice * 0.5);
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

    data[data.length - 1].value = asset.currentPrice;

    const firstPrice = data[0].value;
    const lastPrice = data[data.length - 1].value;
    setPriceChange({
      amount: lastPrice - firstPrice,
      percent: ((lastPrice - firstPrice) / firstPrice) * 100,
    });

    setChartData(data);
  }, [asset, selectedRange]);

  const fetchPriceHistory = useCallback(async () => {
    if (!asset) return;

    setIsLoading(true);
    setSelectedPoint(null);

    try {
      let history: PriceHistoryPoint[] = [];
      const days = timeRanges[selectedRange].days;

      if (asset.type === "crypto" && asset.cryptoId) {
        history = await api.getCryptoHistory(asset.cryptoId, days);
      } else if (asset.type === "stock" || asset.type === "etf") {
        history = await api.getStockHistory(asset.symbol, days);
      }

      if (history.length > 0) {
        const firstPrice = history[0].price;
        const lastPrice = history[history.length - 1].price;
        const changeAmount = lastPrice - firstPrice;
        const changePercent = (changeAmount / firstPrice) * 100;
        setPriceChange({ amount: changeAmount, percent: changePercent });

        const maxPoints = 50;
        const step = Math.ceil(history.length / maxPoints);
        const sampledHistory = history.filter(
          (_, i) => i % step === 0 || i === history.length - 1,
        );

        const formattedData = sampledHistory.map((point, index) => ({
          value: point.price,
          label:
            index % Math.ceil(sampledHistory.length / 5) === 0
              ? point.date
              : "",
          date: point.date,
        }));

        setChartData(formattedData);
      } else {
        generateFallbackData();
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
      generateFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, [asset, selectedRange, generateFallbackData]);

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
            deleteAsset(asset.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!asset) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Asset not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const totalValue = asset.currentPrice * asset.quantity;
  const totalCost = asset.purchasePrice * asset.quantity;
  const gainLoss = totalValue - totalCost;
  const isPositive = gainLoss >= 0;
  const isPriceChangePositive = priceChange
    ? priceChange.amount >= 0
    : isPositive;

  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AssetHeader
        symbol={asset.symbol}
        typeLabel={getTypeLabel()}
        onBack={() => navigation.goBack()}
        onDelete={handleDelete}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <PriceChart
          chartData={chartData}
          isLoading={isLoading}
          selectedRange={selectedRange}
          timeRanges={timeRanges}
          isPriceChangePositive={isPriceChangePositive}
          assetName={asset.name}
          currentPrice={asset.currentPrice}
          selectedPoint={selectedPoint}
          onRangeChange={setSelectedRange}
          onRetry={fetchPriceHistory}
        />

        <PriceStats
          maxValue={maxValue}
          minValue={minValue}
          currentPrice={asset.currentPrice}
        />

        <HoldingsCard
          quantity={asset.quantity}
          purchasePrice={asset.purchasePrice}
          currentPrice={asset.currentPrice}
          totalCost={totalCost}
          totalValue={totalValue}
          gainLoss={gainLoss}
          isPositive={isPositive}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
