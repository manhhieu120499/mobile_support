import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { CalendarCustom } from "../../components";

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 10 },
});

export default function Schedule({ navigation, route }) {
  return (
    <DefaultLayout>
      <Header
        leftIcon={"chevron-left"}
        handleOnPressLeftIcon={() => navigation.goBack("")}
      />
      <View style={styles.container}>
        <CalendarCustom
          handleSelectedDate={(selectedDate) =>
            navigation.navigate("TimeLine", { dateSelected: selectedDate })
          }
        />
      </View>
    </DefaultLayout>
  );
}
