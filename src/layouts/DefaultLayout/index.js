import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
});

export default function DefaultLayout({ children }) {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <SafeAreaView>{children}</SafeAreaView>
      ) : (
        <>{children}</>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
