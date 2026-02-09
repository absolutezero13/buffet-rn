import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
  currencyOptions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "center",
  },
  currencyOption: {
    minWidth: 80,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceLight,
  },
  currencyOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.glass,
  },
  currencyOptionText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  currencyOptionTextActive: {
    color: theme.colors.primary,
  },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: "space-between",
  },
  skipButton: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  nextButton: {
    flex: 1,
  },
  getStartedButton: {
    flex: 1,
  },
});
