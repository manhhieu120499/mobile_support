import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { formatDayOfWeek } from "../../../utilities";

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
      <View style={{ width: "30%", alignItems: "center" }}>
        <Checkbox
          value={isChecked}
          onValueChange={() => {
            setIsChecked((prev) => {
              return !prev;
            });
            handleChooseDayRemove(timeItem, !isChecked, type);
          }}
          style={{ width: 30, height: 30 }}
        />
      </View>
      <View
        style={{ width: "70%", alignItems: "center", justifyContent: "center" }}
      >
        {type == "DAY" && (
          <Text style={style.text}>{timeItem.toISOString().split("T")[0]}</Text>
        )}
        {type == "WEEKOFDAY" && <Text style={style.text}>{timeItem}</Text>}
        {type == "DAYOFWEEK" && (
          <Text style={style.text}>
            {formatDayOfWeek(timeItem.toString().split(" ")[0])} -{" "}
            {timeItem.toISOString().split("T")[0]}
          </Text>
        )}
      </View>
    </View>
  );
}
