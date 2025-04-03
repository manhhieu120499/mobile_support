import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import CheckBox from "expo-checkbox";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    flexDirection: "row",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: "bold" },
  buttonSmall: {
    width: 95,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});

export default function ScheduleCard({ scheduleInfo, isChecked }) {
  return (
    <View style={style.container}>
      <View style={{ width: "100%" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Công nghệ mới trong phát triển ứng dụng CNTT
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          {isChecked && (
            <View style={{ width: "10%" }}>
              <CheckBox value={isChecked} />
            </View>
          )}
          <View style={{ width: !isChecked ? "100%" : "90%" }}>
            <Text style={style.text}>
              <Text style={style.bold}>Người đặt:</Text> Nguyễn Trọng Đạt
            </Text>
            <Text style={style.text}>
              <Text style={style.bold}>Ngày:</Text> 20-02-2020
            </Text>
            <Text style={style.text}>
              <Text style={style.bold}>Thời gian :</Text> từ 08:00 đến 10:00
            </Text>
            <Text style={style.text}>
              <Text style={style.bold}>Loại yêu cầu:</Text> Đặt lịch
            </Text>
            <Text style={style.text}>
              <Text style={style.bold}>Thời gian gửi:</Text> 20-02-2021 - 08:00
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: "#36cb33",
              },
            ]}
          >
            <Text style={style.textButton}>Phê duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: "#dc3640",
              },
            ]}
          >
            <Text style={style.textButton}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: "#003b95",
              },
            ]}
          >
            <Text style={style.textButton}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
