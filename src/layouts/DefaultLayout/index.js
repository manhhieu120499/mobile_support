import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    position: "relative",
  },
});

export default function DefaultLayout({ children }) {
  return (
    <View style={styles.container}>
      {children}
      <StatusBar style="auto" />
    </View>
  );
}
