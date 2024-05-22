import { Easing, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, memo } from "react";
import { Animated } from "react-native";
import { Colors } from "@/constants/Colors";

const CircleContainer = ({ children, delay = 0, ...rest }) => {
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const animateBorderColor = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 1000 + 100 * delay,
          useNativeDriver: false,
          easing : Easing.ease
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 1000 * 2 + 100 * delay,
          useNativeDriver: false,easing : Easing.ease
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBorderColor();
  }, []);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.primaryLight, Colors.light.primary],
  });

  const backgroundColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.background, "rgba(38,212,181,0.2)"],
  });

  return (
    <Animated.View
      style={[styles.container, rest, { borderColor, backgroundColor }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    padding: 15,
    paddingBottom: 0,
    justifyContent: "flex-end",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderColor: "rgba(255, 255, 255, 0.125)",
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
});

export default memo(CircleContainer);
