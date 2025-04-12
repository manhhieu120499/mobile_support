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
    justifyContent: "space-around",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: 550,
    color: "white",
  },
  iconLeftInContainerTitle: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 20,
  },
  iconRightInContainerTitle: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20,
  },

  content: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 5,
  },
});

const renderHeightHeaderByScreen = (nameScreen, platForm) => {
  if (platForm == "ios") {
    switch (nameScreen.toLowerCase()) {
      case "inforoomregister": {
        return 110;
      }
      case "scheduledeatilroom": {
        return 120;
      }
      case "scheduledetailrequest": {
        return 120;
      }
      case "scheduleUser": {
        return 90;
      }
      case "timeline": {
        return 110;
      }
      case "roomdetail": {
        return 110;
      }
      default: {
        return 150;
      }
    }
  } else if (platForm == "android") {
    switch (nameScreen.toLowerCase()) {
      case "inforoomregister": {
        return 100;
      }
      case "scheduledeatilroom": {
        return 90;
      }
      case "scheduledetailrequest": {
        return 90;
      }
      case "scheduleuser": {
        return 60;
      }
      case "timeline": {
        return 90;
      }
      case "roomdetail": {
        return 90;
      }
      default: {
        return 120;
      }
    }
  }
};

export default function Header({
  children,
  leftIcon,
  rightIcon,
  handleOnPressRightIcon,
  handleOnPressLeftIcon,
  nameScreen = "",
}) {
  return (
    <View
      style={[
        styles.container,
        {
          height: renderHeightHeaderByScreen(nameScreen, Platform.OS),
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
            style={styles.iconLeftInContainerTitle}
            onPress={handleOnPressLeftIcon}
          >
            <MaterialIcons name={leftIcon} size={24} color={"white"} />
          </Pressable>
        )}
        <Text style={styles.title}>Đặt lịch họp trực tuyến</Text>
        {rightIcon && (
          <Pressable style={styles.iconRightInContainerTitle}>
            <FontAwesome6Icon name={rightIcon} size={24} color={"white"} />
          </Pressable>
        )}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}
