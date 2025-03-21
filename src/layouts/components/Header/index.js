import React from "react";
import { Platform } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#003b95",
    alignItems: "center",
    justifyContent: "center",
  },
  containerTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: 550,
    color: "white",
  },
  iconInContainerTitle: {
    position: "absolute",
    right: 20,
  },
  content: {
    width: "100%",
    backgroundColor: "red",
    paddingLeft: 12,
  },
});

export default function Header({ children }) {
  return (
    <View
      style={[
        styles.container,
        {
          height: Platform.OS === "ios" ? 150 : 120,
          paddingTop: Platform.OS === "ios" ? 15 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.containerTitle,
          {
            height: Platform.OS === "ios" ? 70 : 60,
          },
        ]}
      >
        <Text style={styles.title}>Booking.com</Text>
        <FontAwesome6Icon
          name="bell"
          size={24}
          color={"white"}
          style={styles.iconInContainerTitle}
        />
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}
