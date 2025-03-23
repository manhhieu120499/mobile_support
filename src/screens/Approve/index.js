import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default function Approve({ navigation, route }) {
  return (
    <DefaultLayout>
      <Header />
      <View style={style.container}>
        <Text>Approve</Text>
      </View>
    </DefaultLayout>
  );
}
