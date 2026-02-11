import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const SETTINGS_HEADER_HEIGHT = 140;
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
    paddingBottom: theme.spacing.xxl,
    paddingTop: SETTINGS_HEADER_HEIGHT + theme.spacing.md,
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
    height: SETTINGS_HEADER_HEIGHT,
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
  card: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  sectionDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
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
    marginTop: 12,
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
  signOutButton: {
    marginTop: theme.spacing.sm,
    color: theme.colors.dangerLight,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  currency: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.sm,
  },
});
