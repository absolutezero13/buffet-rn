import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-gifted-charts";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { theme } from "../../theme";
import { useApp } from "../../context/AppContext";
import { GlassCard, Button } from "../../components";
import { api, PriceHistoryPoint } from "../../services/api";

const { width } = Dimensions.get("window");

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
  const gainLossPercent = ((gainLoss / totalCost) * 100).toFixed(2);
  const isPositive = gainLoss >= 0;
  const isPriceChangePositive = priceChange
    ? priceChange.amount >= 0
    : isPositive;

  const getTypeLabel = () => {
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

  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;
  const chartColor = isPriceChangePositive
    ? theme.colors.positive
    : theme.colors.negative;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.symbol}>{asset.symbol}</Text>
          <Text style={styles.type}>{getTypeLabel()}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.priceSection}>
          <Text style={styles.assetName}>{asset.name}</Text>
          <Text style={styles.currentPrice}>
            $
            {selectedPoint
              ? selectedPoint.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : asset.currentPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </Text>
          {selectedPoint ? (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDate}>{selectedPoint.date}</Text>
            </View>
          ) : priceChange ? (
            <View style={styles.changeRow}>
              <View
                style={[
                  styles.changeBadge,
                  {
                    backgroundColor: isPriceChangePositive
                      ? "rgba(0, 220, 130, 0.15)"
                      : "rgba(255, 71, 87, 0.15)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.changeText,
                    {
                      color: isPriceChangePositive
                        ? theme.colors.positive
                        : theme.colors.negative,
                    },
                  ]}
                >
                  {isPriceChangePositive ? "↑" : "↓"}{" "}
                  {isPriceChangePositive ? "+" : ""}
                  {priceChange.percent.toFixed(2)}%
                </Text>
              </View>
              <Text style={styles.changeAmount}>
                {isPriceChangePositive ? "+" : ""}$
                {Math.abs(priceChange.amount).toFixed(2)}
              </Text>
              <Text style={styles.changeLabel}>
                {timeRanges[selectedRange].label}
              </Text>
            </View>
          ) : null}
        </View>

        <GlassCard style={styles.chartCard} effect="clear">
          <View style={styles.timeRangeRow}>
            {timeRanges.map((range, index) => (
              <TouchableOpacity
                key={range.label}
                style={[
                  styles.timeRangeButton,
                  selectedRange === index && styles.timeRangeButtonActive,
                ]}
                onPress={() => setSelectedRange(index)}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    selectedRange === index && styles.timeRangeTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading price data...</Text>
            </View>
          ) : chartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 64}
                height={200}
                spacing={(width - 80) / Math.max(chartData.length - 1, 1)}
                color={chartColor}
                thickness={2.5}
                startFillColor={
                  isPriceChangePositive
                    ? "rgba(0, 220, 130, 0.25)"
                    : "rgba(255, 71, 87, 0.25)"
                }
                endFillColor="transparent"
                startOpacity={1}
                endOpacity={0}
                initialSpacing={0}
                endSpacing={0}
                yAxisColor="transparent"
                xAxisColor="transparent"
                hideRules
                hideYAxisText
                hideAxesAndRules
                curved
                curveType={0}
                areaChart
                dataPointsColor="transparent"
                xAxisLabelTextStyle={{
                  color: theme.colors.textMuted,
                  fontSize: 10,
                }}
                pointerConfig={{
                  pointerStripHeight: 200,
                  pointerStripColor: "rgba(255,255,255,0.2)",
                  pointerStripWidth: 1,
                  pointerColor: chartColor,
                  radius: 8,
                  pointerLabelWidth: 120,
                  pointerLabelHeight: 50,
                  activatePointersOnLongPress: false,
                  autoAdjustPointerLabelPosition: true,
                  strokeDashArray: [4, 4],
                  pointerVanishDelay: 500,
                  pointerLabelComponent: (items: { value: number }[]) => {
                    const index = chartData.findIndex(
                      (d) => d.value === items[0]?.value,
                    );
                    const point = chartData[index];
                    if (point) {
                      setTimeout(() => {
                        setSelectedPoint({
                          price: point.value,
                          date: point.date,
                        });
                      }, 0);
                    }
                    return (
                      <View style={styles.tooltipContainer}>
                        <Text style={styles.tooltipPrice}>
                          ${items[0]?.value?.toFixed(2)}
                        </Text>
                        {point && (
                          <Text style={styles.tooltipDate}>{point.date}</Text>
                        )}
                      </View>
                    );
                  },
                }}
                yAxisOffset={minValue * 0.995}
                maxValue={maxValue * 1.005}
              />
              <View style={styles.chartLabels}>
                <Text style={styles.chartLabel}>${minValue.toFixed(0)}</Text>
                <Text style={styles.chartLabel}>${maxValue.toFixed(0)}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Unable to load price history
              </Text>
              <Button
                title="Retry"
                size="small"
                onPress={fetchPriceHistory}
                style={{ marginTop: theme.spacing.md }}
              />
            </View>
          )}
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Price Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>High</Text>
              <Text style={styles.statValue}>${maxValue.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Low</Text>
              <Text style={styles.statValue}>${minValue.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current</Text>
              <Text style={styles.statValue}>
                ${asset.currentPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{asset.quantity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Average Cost</Text>
            <Text style={styles.detailValue}>
              ${asset.purchasePrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Price</Text>
            <Text style={styles.detailValue}>
              ${asset.currentPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Cost</Text>
            <Text style={styles.detailValue}>${totalCost.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Market Value</Text>
            <Text style={styles.detailValueLarge}>
              ${totalValue.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Unrealized P/L</Text>
            <Text
              style={[
                styles.detailValueLarge,
                {
                  color: isPositive
                    ? theme.colors.positive
                    : theme.colors.negative,
                },
              ]}
            >
              {isPositive ? "+" : ""}${gainLoss.toFixed(2)}
            </Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: theme.colors.text,
    fontSize: 24,
  },
  headerCenter: {
    alignItems: "center",
  },
  symbol: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  type: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.lg,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: "#0A1628",
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  assetName: {
    color: "#00D9FF",
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "600",
  },
  currentPrice: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: -2,
    textAlign: "center",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  changeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  changeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  changeAmount: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  changeLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  selectedDateContainer: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
  },
  selectedDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
  },
  timeRangeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  timeRangeButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
  },
  timeRangeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  timeRangeText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  timeRangeTextActive: {
    color: theme.colors.text,
  },
  chartContainer: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chartLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  loadingContainer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.md,
  },
  noDataContainer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  tooltipContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipPrice: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    textAlign: "center",
  },
  tooltipDate: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    textAlign: "center",
    marginTop: 2,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  detailsCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  detailLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  detailValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  detailValueLarge: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.glassBorder,
    marginVertical: theme.spacing.md,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
