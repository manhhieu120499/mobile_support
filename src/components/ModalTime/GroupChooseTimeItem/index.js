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

export default function GroupChooseTimeItem({
  timeItem,
  handleChooseDayRemove,
  type,
}) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={style.container}>
      <View style={{ width: "40%", alignItems: "center" }}>
        <Checkbox
          value={isChecked}
          onValueChange={() =>
            setIsChecked((prev) => {
              handleChooseDayRemove(timeItem, !prev);
              return !prev;
            })
          }
        />
      </View>
      <View
        style={{ width: "60%", alignItems: "center", justifyContent: "center" }}
      >
        {type == "DAY" && (
          <Text style={style.text}>{timeItem.toISOString().split("T")[0]}</Text>
        )}
        {type == "WEEKOFDAY" && (
          <Text style={style.text}>{timeItem.toString().split(" ")[0]}</Text>
        )}
      </View>
    </View>
  );
}
