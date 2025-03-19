import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { DefaultLayout } from "../../layouts";

const style = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default function Profile({ navigation, route }) {
  return (
    <DefaultLayout>
      <View style={style.container}>
        <Text>Profile</Text>
      </View>
    </DefaultLayout>
  );
}
