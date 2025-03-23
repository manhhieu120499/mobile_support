import React from "react";
import { Platform, Pressable } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
  iconLeftInContainerTitle: {
    position: "absolute",
    right: 20,
  },
  iconRightInContainerTitle: {
    position: "absolute",
    left: 20,
  },

  content: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default function Header({
  children,
  leftIcon,
  rightIcon,
  handleOnPressRightIcon,
}) {
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
        {leftIcon && (
          <Pressable
            style={styles.iconRightInContainerTitle}
            onPress={handleOnPressRightIcon}
          >
            <MaterialIcons name={leftIcon} size={24} color={"white"} />
          </Pressable>
        )}
        <Text style={styles.title}>Booking.com</Text>
        {rightIcon && (
          <Pressable style={styles.iconLeftInContainerTitle}>
            <FontAwesome6Icon name={rightIcon} size={24} color={"white"} />
          </Pressable>
        )}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}
