import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import DropdownCustom from "../DropdownCustom";
import { renderTime } from "../../utilities";

// data branch fake
const dataBranch = [
  {
    id: 1,
    name: "TP. Hồ Chí Minh",
  },
  {
    id: 2,
    name: "Hà Nội",
  },
  {
    id: 3,
    name: "Tây Ninh",
  },
];

const renderDurationTimeMeeting = () => {
  const durations = [];
  for (let i = 1; i <= 8; i++) {
    durations.push({ time: `${30 * i} phút` });
  }
  return durations;
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: "#e7e7e7",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    width: "80%",
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingTop: 10,
  },
  contentItem: {
    width: "100%",
    minHeight: 40,
    marginBottom: 10,
  },
  labelFilter: {
    marginBottom: 8,
    fontSize: 15,
  },
});

const { width } = Dimensions.get("window");

export default function ModalSideBar({
  branchOption,
  timeStartOption,
  capacityOption,
  timeEndOption,
  onCloseModal,
  isVisible,
}) {
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -width, // Trượt vào nếu mở, trượt ra nếu đóng
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);
  return (
    <Modal transparent={true} visible={isVisible} animationType="none">
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[style.container, { transform: [{ translateX }] }]}
        >
          <View style={style.content}>
            <View style={{ height: 35 }} />
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Chi nhánh</Text>
              <DropdownCustom
                data={dataBranch}
                value={branchOption.branchValue}
                handleOnChange={(item) =>
                  branchOption.setBranchValue(item.name)
                }
                labelOfValue={"name"}
              />
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Ngày</Text>
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Thời gian bắt đầu</Text>
              <DropdownCustom
                data={renderTime()}
                value={timeStartOption.timeStart}
                handleOnChange={(item) =>
                  timeStartOption.setTimeStart(item.time)
                }
                labelOfValue={"time"}
                nameIcon="clock"
              />
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Thời gian họp</Text>
              <DropdownCustom
                data={renderDurationTimeMeeting()}
                value={timeEndOption.timeEnd}
                handleOnChange={timeEndOption.setTimeEnd}
                labelOfValue={"time"}
                nameIcon="clock"
              />
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Sức chứa</Text>
              <View
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "white",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <TextInput
                  placeholder="Nhập sức chứa"
                  value={capacityOption.capacity}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    Number.parseInt(text) > 0 &&
                    capacityOption.setCapacity(text)
                  }
                  style={{ fontSize: 18, height: "100%", paddingLeft: 12 }}
                />
              </View>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Animated.timing(translateX, {
                toValue: -width, // Trượt vào nếu mở, trượt ra nếu đóng
                duration: 500,
                useNativeDriver: true,
              }).start(onCloseModal);
            }}
          >
            <View
              style={{ width: "20%", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </Modal>
  );
}
