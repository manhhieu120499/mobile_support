import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  container: {
    width: 300,
    top: "35%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    height: 40,
    lineHeight: 40,
  },
  content: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  info: {
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
  },
  infoButton: { fontSize: 15, fontWeight: "400", color: "white" },
  button: { width: 100, height: 40, backgroundColor: "#003b95" },
  groupButton: {
    flex: 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  medium: {
    height: 200,
  },
  default: {
    height: 170,
  },
  large: {
    height: 250,
  },
});

export default function Popup({
  isOpen,
  title,
  status,
  content,
  titleButtonAccept,
  titleButtonReject,
  size = "default",
  handleOnPopup = () => {},
  handleViewDetailError = undefined,
}) {
  return (
    <>
      {isOpen && (
        <View style={styles.overlay}>
          <View style={[styles.container, styles[size]]}>
            <Text
              style={[
                styles.title,
                {
                  color:
                    status == "error"
                      ? "#c31818"
                      : status == "warning"
                      ? "#ffa300"
                      : "green",
                },
              ]}
            >
              {title}
            </Text>
            <View style={styles.content}>
              <Text style={styles.info}>{content}</Text>
              {status == "error" && handleViewDetailError && (
                <Button
                  style={[
                    styles.button,
                    {
                      width: 140,
                      alignSelf: "center",
                      marginTop: 15,
                      backgroundColor: "#c31818",
                    },
                  ]}
                  onPress={handleViewDetailError}
                >
                  <Text style={styles.infoButton}>Xem chi tiết</Text>
                </Button>
              )}
            </View>
            <View style={styles.groupButton}>
              {titleButtonReject && (
                <Button
                  style={[
                    styles.button,
                    {
                      backgroundColor: status == "error" ? "gray" : "#003b95",
                    },
                  ]}
                  onPress={() => handleOnPopup(titleButtonReject)}
                >
                  <Text style={styles.infoButton}>{titleButtonReject}</Text>
                </Button>
              )}
              {titleButtonAccept && (
                <Button
                  style={styles.button}
                  onPress={() => handleOnPopup(titleButtonAccept)}
                >
                  <Text style={styles.infoButton}>{titleButtonAccept}</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
}
