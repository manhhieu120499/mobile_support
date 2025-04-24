import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import DropdownCustom from "../DropdownCustom";
import {
  axiosConfig,
  findTimeFitToRegisterRoom,
  renderTime,
} from "../../utilities";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ModalTime from "../ModalTime";
import ModalCalendar from "../ModalCalendar";

// data branch fake
// const dataBranch = [
//   {
//     id: 1,
//     name: "TP. Hồ Chí Minh",
//   },
//   {
//     id: 2,
//     name: "Hà Nội",
//   },
//   {
//     id: 3,
//     name: "Tây Ninh",
//   },
// ];

const renderDurationTimeMeeting = () => {
  const durations = [];
  for (let i = 1; i <= 8; i++) {
    durations.push({ time: `${30 * i} phút` });
  }
  return durations;
};

function getDurationSlots(startTimeStr, endTimeStr) {
  const durations = [];
  const maxDuration = 240; // giới hạn tối đa 240 phút
  const step = 30; // mỗi bước là 30 phút

  const [startHour, startMinute] = startTimeStr.split(":").map(Number);
  const [endHour, endMinute] = endTimeStr.split(":").map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  let totalDuration = Math.min(end - start, maxDuration);

  for (let t = step; t <= totalDuration; t += step) {
    durations.push({ time: `${t} phút` });
  }

  return durations;
}

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
  selectedDateOption,
  onCloseModal,
  isVisible,
}) {
  const translateX = useRef(new Animated.Value(width)).current;
  const [isOpenModalSelectedDate, setIsOpenModalSelectedDate] = useState(false);
  const [arrTimeStart, setArrTimeStart] = useState(() => renderTime());
  const [dataBranch, setDataBranch] = useState([]);
  const [branchChoose, setBranchChoose] = useState();
  const [durationChoose, setDurationChoose] = useState(
    () => renderDurationTimeMeeting()[0]
  );
  const [timeStartChoose, setTimeStartChoose] = useState(() => {
    return renderTime().find(
      (item) => item.time == timeStartOption.timeStart
    ) != null
      ? renderTime().find((item) => item.time == timeStartOption.timeStart)
      : timeStartOption.timeStart;
  });
  const [renderTimeDuration, setRenderTimeDuration] = useState(() =>
    renderDurationTimeMeeting()
  );

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -width, // Trượt vào nếu mở, trượt ra nếu đóng
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // lấy danh sách các chi nhánh
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosConfig().get("/api/v1/location/getAllBranch");
        if (res.status == 200) {
          const data = res.data.map((item) => ({
            id: item.branchId,
            name: item.branchName,
          }));
          setDataBranch(data);
          setBranchChoose(data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // xử lý thời gian
  useEffect(() => {
    // đã qua giờ đăng ký
    if (findTimeFitToRegisterRoom() == 0) {
      setArrTimeStart(renderTime());
      setTimeStartChoose(renderTime()[0]);
      timeStartOption.setTimeStart(renderTime()[0].time);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      selectedDateOption.setSelectedDate(tomorrow.toISOString().split("T")[0]);
    }
  }, []);

  //xử lý thời lượng họp
  useEffect(() => {
    setRenderTimeDuration(getDurationSlots("07:00", "18:00"));
  }, [timeStartChoose]);

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
                value={branchChoose}
                handleOnChange={(item) => {
                  branchOption.setBranchValue(item.name);
                  setBranchChoose(item);
                }}
                labelOfValue={"name"}
                valueField={"name"}
                nameIcon="other-houses"
              />
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Ngày</Text>
              <View
                style={[
                  style.contentItem,
                  {
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: "#b8b8b8",
                    alignItems: "center",
                    height: 45,
                    borderRadius: 5,
                  },
                ]}
              >
                <TextInput
                  placeholder="Ngày hiện tại"
                  style={{ height: "100%", width: "85%" }}
                  value={selectedDateOption.selectedDate}
                  editable={false}
                />
                <Pressable
                  style={{ width: "15%", alignItems: "center" }}
                  onPress={() => setIsOpenModalSelectedDate(true)}
                >
                  <MaterialIcon name="calendar-month" size={20} />
                </Pressable>
              </View>
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Thời gian bắt đầu</Text>
              <DropdownCustom
                data={arrTimeStart}
                value={timeStartChoose}
                handleOnChange={(item) => {
                  timeStartOption.setTimeStart(item.time);
                  setTimeStartChoose(item);
                }}
                labelOfValue={"time"}
                valueField={"time"}
                nameIcon="punch-clock"
              />
            </View>
            <View style={style.contentItem}>
              <Text style={style.labelFilter}>Thời gian họp</Text>
              <DropdownCustom
                data={renderTimeDuration}
                value={durationChoose}
                handleOnChange={(item) => {
                  timeEndOption.setTimeEnd(item.time);
                  setDurationChoose(item);
                }}
                labelOfValue={"time"}
                valueField={"time"}
                nameIcon="punch-clock"
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
                  onChangeText={(text) => capacityOption.setCapacity(text)}
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

          {/** Modal selected date */}
          <ModalCalendar
            isOpenModal={isOpenModalSelectedDate}
            handleOnModal={(selectedDate) => {
              selectedDateOption.setSelectedDate(selectedDate);
              if (selectedDate != new Date().toISOString().split("T")[0]) {
                setArrTimeStart(renderTime());
                setTimeStartChoose(renderTime()[0]);
                timeStartOption.setTimeStart(renderTime()[0].time);
              } else {
                setArrTimeStart((prev) => {
                  const indexTimeStart = renderTime().findIndex(
                    (item) => item.time == findTimeFitToRegisterRoom()
                  );
                  return renderTime().slice(
                    indexTimeStart,
                    renderTime().length
                  );
                });
                setTimeStartChoose(findTimeFitToRegisterRoom());
                timeStartOption.setTimeStart(findTimeFitToRegisterRoom());
              }
              setIsOpenModalSelectedDate(false);
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
