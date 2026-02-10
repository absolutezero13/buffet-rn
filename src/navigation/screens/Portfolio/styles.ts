import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const PORTFOLIO_HEADER_HEIGHT = 140;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingTop: PORTFOLIO_HEADER_HEIGHT + theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    position: "absolute",
    width: "100%",
    zIndex: 10,
    borderBottomEndRadius: theme.borderRadius.xxl,
    borderBottomStartRadius: theme.borderRadius.xxl,
    top: 0,
    height: PORTFOLIO_HEADER_HEIGHT,
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
    textAlign: "center",
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
  currencySelector: {
    marginBottom: theme.spacing.md,
  },
  currencyLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  currencyOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  currencyOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceLight,
  },
  currencyOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.glass,
  },
  currencyOptionText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  currencyOptionTextActive: {
    color: theme.colors.primary,
  },
  addButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});
