import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles";

export function PortfolioHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Portfolio</Text>
      <Text style={styles.subtitle}>Track your investments</Text>
    </View>
  );
}
