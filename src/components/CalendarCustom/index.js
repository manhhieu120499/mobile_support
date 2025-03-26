import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarCustom({
  handleSelectedDate = (selected) => {},
}) {
  const [selected, setSelected] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <View
      style={{
        width: "100%",
        height: 520,
        backgroundColor: "white",
        paddingTop: 50,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Lịch
      </Text>
      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, selectedColor: "blue" },
        }}
        theme={{
          backgroundColor: "white",
          calendarBackground: "white",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "blue",
          selectedDayTextColor: "white",
          todayTextColor: "red",
          dayTextColor: "black",
          arrowColor: "black",
          monthTextColor: "black",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        minDate={new Date().toString()}
      />
      <TouchableOpacity
        style={{
          width: 100,
          height: 35,
          backgroundColor: "#01c4dc",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-end",
          borderRadius: 10,
          marginTop: 5,
          marginRight: 10,
        }}
        onPress={() => handleSelectedDate(selected)}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Xác nhận
        </Text>
      </TouchableOpacity>
    </View>
  );
}
