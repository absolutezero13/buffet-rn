import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { theme } from "../../../../theme";
import { Button } from "../../../../components";
import { styles, CHART_WIDTH } from "../styles";

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
}: PriceChartProps) {
  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const chartColor = isPriceChangePositive
    ? theme.colors.positive
    : theme.colors.negative;

  return (
    <View style={styles.chartCard}>
      <View style={styles.timeRangeRow}>
        {timeRanges.map((range, index) => (
          <TouchableOpacity
            key={range.label}
            style={[
              styles.timeRangeButton,
              selectedRange === index && styles.timeRangeButtonActive,
            ]}
            onPress={() => onRangeChange(index)}
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
          <View style={styles.chartOverlay}>
            <Text style={styles.chartOverlayName}>{assetName}</Text>
            <Text style={styles.chartOverlayPrice}>
              $
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
            startOpacity={1}
            endOpacity={0}
            initialSpacing={0}
            isAnimated
            endSpacing={0}
            yAxisColor="transparent"
            xAxisColor="transparent"
            hideRules
            hideYAxisText
            areaChart
            dataPointsColor="transparent"
            animateOnDataChange
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
              pointerVanishDelay: 200,
              pointerLabelComponent: (items: { value: number }[]) => {
                const index = chartData.findIndex(
                  (d) => d.value === items[0]?.value,
                );
                const point = chartData[index];

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
          />
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
