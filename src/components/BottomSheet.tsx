import React, { forwardRef, ReactNode } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { TrueSheet, TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { theme } from "../theme";

interface BottomSheetProps extends Partial<TrueSheetProps> {
  children: ReactNode;
  title?: string;
}

export type BottomSheetRef = TrueSheet;

export const BottomSheet = forwardRef<TrueSheet, BottomSheetProps>(
  ({ children, title, ...props }, ref) => {
    return (
      <TrueSheet
        ref={ref}
        detents={["auto"]}
        cornerRadius={theme.borderRadius.xl}
        {...props}
        backgroundColor={theme.colors.surface}
      >
        <View style={styles.container}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </TrueSheet>
    );
  },
);

BottomSheet.displayName = "BottomSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    textAlign: "center",
  },
  content: {
    padding: theme.spacing.lg,
  },
});
