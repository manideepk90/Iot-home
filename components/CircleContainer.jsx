import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import { Colors } from "@/constants/Colors";

const CircleContainer = ({ children, delay = 0, ...rest }) => {
  return <View style={[styles.container, rest]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    padding: 15,
    paddingBottom: 0,
    justifyContent: "flex-end",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderColor: Colors.light.primary,
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
});

export default memo(CircleContainer);
