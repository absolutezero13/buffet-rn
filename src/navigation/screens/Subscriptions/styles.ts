import { StyleSheet } from "react-native";
import { TAB_HEADER_HEIGHT } from "../../../components/TabHeader";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  contentContainer: {
    paddingTop: TAB_HEADER_HEIGHT + theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyCard: {
    alignItems: "center",
    paddingBottom: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
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
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  sheetBody: {
    flex: 1,
  },
  selectorGroup: {
    marginBottom: theme.spacing.md,
  },
  selectorLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  segmentedOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  segmentedOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceLight,
  },
  segmentedOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.glass,
  },
  segmentedOptionText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  segmentedOptionTextActive: {
    color: theme.colors.primary,
  },
  addButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
