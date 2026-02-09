import { createRef, useState } from "react";
import { BottomSheet } from "../../../../components/BottomSheet";
import { weightUnitOptions } from "../../../constants";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Button } from "../../../../components";
import useWeightUnitStore from "../../../../store/useWeightUnitStore";
import { theme } from "../../../../theme";

export const globalWeightUnitBottomSheetRef = createRef<TrueSheet>();

const WeightUnitBottomSheet = () => {
  const { weightUnit, setWeightUnit } = useWeightUnitStore();
  const [selectedUnit, setSelectedUnit] = useState(weightUnit?.id);

  return (
    <BottomSheet
      ref={globalWeightUnitBottomSheetRef}
      title="Select Weight Unit"
    >
      <View style={localStyles.optionsContainer}>
        {weightUnitOptions.map((option) => {
          const isActive = option.id === selectedUnit;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                localStyles.unitOption,
                isActive && localStyles.unitOptionActive,
              ]}
              onPress={() => setSelectedUnit(option.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  localStyles.symbolContainer,
                  isActive && localStyles.symbolContainerActive,
                ]}
              >
                <Text
                  style={[
                    localStyles.symbol,
                    isActive && localStyles.symbolActive,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
              <View style={localStyles.labelContainer}>
                <Text
                  style={[
                    localStyles.unitCode,
                    isActive && localStyles.unitCodeActive,
                  ]}
                >
                  {option.id}
                </Text>
                <Text style={localStyles.unitName}>{option.fullName}</Text>
              </View>
              {isActive && (
                <View style={localStyles.checkmark}>
                  <Text style={localStyles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        onPress={async () => {
          const unit = weightUnitOptions.find(
            (option) => option.id === selectedUnit,
          );
          if (unit) {
            await setWeightUnit(unit);
          }
          globalWeightUnitBottomSheetRef.current?.dismiss();
        }}
        title="Confirm"
      />
    </BottomSheet>
  );
};

const localStyles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  unitOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceLight,
  },
  unitOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(0, 217, 255, 0.08)",
  },
  symbolContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  symbolContainerActive: {
    backgroundColor: "rgba(0, 217, 255, 0.15)",
  },
  symbol: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  symbolActive: {
    color: theme.colors.primary,
  },
  labelContainer: {
    flex: 1,
  },
  unitCode: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  unitCodeActive: {
    color: theme.colors.primary,
  },
  unitName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
});

export default WeightUnitBottomSheet;
