import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { theme } from "../../../../theme";
import { Button } from "../../../../components";
import { styles, CHART_WIDTH } from "../styles";
import useCurrencyStore from "../../../../store/useCurrencyStore";
import GlassPicker from "../../../../components/GlassPicker";
import { Image } from "expo-image";

interface ChartDataPoint {
  value: number;
  label: string;
  date: string;
}

interface TimeRange {
  label: string;
  days: number;
}

interface PriceChartProps {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  selectedRange: number;
  timeRanges: TimeRange[];
  isPriceChangePositive: boolean;
  assetName: string;
  currentPrice: number;
  selectedPoint: { price: number; date: string } | null;
  onRangeChange: (index: number) => void;
  onRetry: () => void;
  isSubscribed?: boolean;
  onPaywallPress?: () => void;
  onChartInteraction?: (scrollEnabled: boolean) => void;
}

export function PriceChart({
  chartData,
  isLoading,
  selectedRange,
  timeRanges,
  isPriceChangePositive,
  assetName,
  currentPrice,
  selectedPoint,
  onRangeChange,
  onRetry,
  isSubscribed = true,
  onPaywallPress,
  onChartInteraction,
}: PriceChartProps) {
  const { userCurrency } = useCurrencyStore();
  const symbol = userCurrency.symbol;
  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const chartColor = isPriceChangePositive
    ? theme.colors.positive
    : theme.colors.negative;

  return (
    <View style={styles.chartCard}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading price data...</Text>
        </View>
      ) : chartData.length > 0 ? (
        <View
          style={styles.chartContainer}
          onTouchStart={() => onChartInteraction?.(false)}
          onTouchEnd={() => onChartInteraction?.(true)}
          onTouchCancel={() => onChartInteraction?.(true)}
        >
          <View style={styles.chartOverlay}>
            <Text style={styles.chartOverlayName}>{assetName}</Text>
            <Text style={styles.chartOverlayPrice}>
              {symbol}
              {selectedPoint
                ? selectedPoint.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : currentPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </Text>
          </View>
          <LineChart
            onPress={() => {
              console.log("press");
            }}
            data={chartData}
            width={CHART_WIDTH}
            height={200}
            spacing={CHART_WIDTH / chartData.length}
            color={chartColor}
            thickness={2.5}
            startFillColor={
              isPriceChangePositive
                ? "rgba(0, 220, 130, 0.25)"
                : "rgba(255, 71, 87, 0.25)"
            }
            endFillColor="transparent"
            bounces={false}
            startOpacity={1}
            endOpacity={0}
            initialSpacing={0}
            xAxisType="solid"
            xAxisLabelsHeight={10}
            isAnimated
            endSpacing={0}
            yAxisColor="transparent"
            hideRules
            hideYAxisText
            areaChart
            dataPointsColor="transparent"
            animateOnDataChange
            pointerConfig={{
              pointerStripHeight: 200,
              pointerStripColor: "rgba(255,255,255,0.2)",
              pointerStripWidth: 1,
              pointerColor: chartColor,
              radius: 8,
              pointerLabelWidth: 120,
              pointerLabelHeight: 50,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              strokeDashArray: [4, 4],
              pointerVanishDelay: 200,

              pointerLabelComponent: (items: { value: number }[]) => {
                const index = chartData.findIndex(
                  (d) => d.value === items[0]?.value,
                );
                const point = chartData[index];

                return (
                  <View style={styles.tooltipContainer}>
                    <Text style={styles.tooltipPrice}>
                      {symbol}
                      {items[0]?.value?.toFixed(2)}
                    </Text>
                    {point && (
                      <Text style={styles.tooltipDate}>{point.date}</Text>
                    )}
                  </View>
                );
              },
            }}
            yAxisOffset={minValue * 0.995}
          />
          {!isSubscribed && (
            <Pressable style={blurStyles.blurOverlay} onPress={onPaywallPress}>
              <View style={blurStyles.blurContent}>
                <Image
                  source={require("../../../../assets/lock.png")}
                  style={blurStyles.lockEmoji}
                />
              </View>
              <Text style={blurStyles.blurText}>
                {" "}
                Subscribe to view price charts{" "}
              </Text>
              <Text style={blurStyles.blurSubtext}> Tap to unlock </Text>
            </Pressable>
          )}
          <View style={styles.timeRangeRow}>
            <GlassPicker
              options={timeRanges.map((r) => r.label)}
              selectedIndex={selectedRange}
              setSelectedIndex={onRangeChange}
            />
          </View>
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Unable to load price history</Text>
          <Button
            title="Retry"
            size="small"
            onPress={onRetry}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      )}
    </View>
  );
}

const blurStyles = StyleSheet.create({
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 10, 20, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
    zIndex: 20,
  },
  blurContent: {
    alignItems: "center",
  },
  lockEmoji: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  blurText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  blurSubtext: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
});
