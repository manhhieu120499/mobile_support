import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

const style = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default function GroupServeItem({ item, handleChooseItemRemove }) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={style.container}>
      <View style={{ width: "40%", alignItems: "center" }}>
        <Checkbox
          value={isChecked}
          onValueChange={() =>
            setIsChecked((prev) => {
              handleChooseItemRemove(item, !prev);
              return !prev;
            })
          }
        />
      </View>
      <View
        style={{ width: "60%", alignItems: "center", justifyContent: "center" }}
      >
        <Text style={style.text}>{item.name}</Text>
      </View>
    </View>
  );
}
