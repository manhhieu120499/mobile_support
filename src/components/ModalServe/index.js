import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import GroupServeItem from "./GroupServeItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ModalServe({
  dataModal,
  isOpenModal,
  handleCloseModal,
  handleRemoveItem,
  handleAcceptedRemoveItem,
  title,
  type,
}) {
  return (
    <>
      {isOpenModal && (
        <Modal transparent={true} animationType="slide" visible={isOpenModal}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                height: 400,
                width: "100%",
                position: "relative",
                backgroundColor: "white",
                top: "30%",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 40,
                paddingBottom: 20,
              }}
            >
              <Pressable
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleCloseModal}
              >
                <MaterialIcons name="close" size={22} color={"black"} />
              </Pressable>
              {title && (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  {title}
                </Text>
              )}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#e7e7e7",
                  borderRadius: 8,
                  height: 270,
                }}
              >
                <FlatList
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    paddingVertical: 15,
                  }}
                  data={dataModal}
                  renderItem={({ item }, index) => (
                    <GroupServeItem
                      key={index}
                      item={item}
                      handleChooseItemRemove={handleRemoveItem}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "#00c4dc",
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => handleAcceptedRemoveItem(type)}
              >
                <Text
                  style={{ textAlign: "center", color: "white", fontSize: 16 }}
                >
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
