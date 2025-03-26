import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import CalendarCustom from "../CalendarCustom";

export default function ModalCalendar({ isOpenModal, handleOnModal }) {
  return (
    <>
      {isOpenModal && (
        <Modal transparent={true} animationType="slide">
          <View
            style={{
              position: "absolute",
              backgroundColor: "rgba(0,0,0,0.5)",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
              justifyContent: "center",
            }}
          >
            <CalendarCustom
              handleSelectedDate={(selectedDate) => handleOnModal(selectedDate)}
            />
          </View>
        </Modal>
      )}
    </>
  );
}
