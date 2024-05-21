import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useResponsiveFontSize from "@/hooks/useResponsiveFontSize";
const MainTitle = ({ children }: { children: string }) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "ElMessiri-Bold", ...styles.title }}>
        {children}
      </Text>
    </View>
  );
};

export default MainTitle;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: useResponsiveFontSize(20),
    lineHeight: 80,
  },
});
