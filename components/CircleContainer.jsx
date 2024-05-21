import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default CircleContainer = ({ children, ...rest }) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
      padding: 15,
      paddingBottom: 0,
      justifyContent: "flex-end",
      borderTopLeftRadius: 150,
      borderTopRightRadius: 150,
      borderColor: "#26D4B5",
      alignItems: "center",
      borderWidth: 1,
      borderBottomWidth: 0,
      ...rest,
    },
  });

  return <View style={styles.container}>{children}</View>;
};
