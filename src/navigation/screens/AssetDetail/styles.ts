import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../theme";

const { width } = Dimensions.get("window");

export const CHART_WIDTH = width;
export const HEADER_HEIGHT = 140;

export const styles = StyleSheet.create({
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
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    zIndex: 100,
    borderBottomEndRadius: theme.borderRadius.xxl,
    borderBottomStartRadius: theme.borderRadius.xxl,
    height: HEADER_HEIGHT,
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
  },
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
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
    position: "relative",
    paddingTop: 64,
  },
  chartOverlay: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 10,
  },
  chartOverlayName: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "500",
  },
  chartOverlayPrice: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
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
    marginHorizontal: theme.spacing.md,
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
    marginHorizontal: theme.spacing.md,
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
