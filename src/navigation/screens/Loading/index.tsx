import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../theme";
import { styles } from "./styles";

const BISON = require("../../../assets/bison.png");

export function Loading() {
  const navigation = useNavigation();
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const tiltAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(tiltAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: -1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    tiltAnimation.start();

    return () => tiltAnimation.stop();
  }, [tiltAnim]);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Paywall" as never);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const rotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const dots = ".".repeat(dotCount);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.Image
          source={BISON}
          style={[
            styles.emoji,
            { transform: [{ rotate: rotation }] },
          ]}
        />
        <Text style={styles.stepText}>
          Almost ready{dots}
        </Text>
      </View>
    </View>
  );
}
