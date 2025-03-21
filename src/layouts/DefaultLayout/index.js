import React from "react";
import { View, StyleSheet, StatusBar, Platform, Text } from "react-native";
import Header from "../components/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  content: {
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default function DefaultLayout({ children }) {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>{children}</View>
      <StatusBar style="auto" />
    </View>
  );
}
