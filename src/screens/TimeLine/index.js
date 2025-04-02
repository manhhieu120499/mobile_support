import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { DropdownCustom, ModalCalendar, Popup } from "../../components";
import { axiosConfig, formatTime, renderTime } from "../../utilities";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 10 },
  contentItem: {
    width: "100%",
    height: 80,
    marginBottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  inputInContentItem: {
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 5,
  },
  labelInputContentItem: {
    fontSize: 17,
    fontWeight: "bold",
    textDecoration: "underline",
    marginVertical: 7,
  },
  inputContent: {
    height: "100%",
    fontSize: 15,
  },
  labelNotCheck: {
    fontSize: 15,
    fontWeight: "400",
    height: "100%",
  },
});

const statusRoom = {
  WAITING: "Chờ nhận phòng",
  PENDING: "Chờ phê duyệt",
  CHECKED_IN: "Đã nhận phòng",
  COMPLETED: "Đã hoàn thành",
  NOT_CHECKED_IN: "Không nhận phòng",
};

const backgroundSchedule = {
  WAITING: "#e3f2fd",
  PENDING: "#fff8ce",
  CHECKED_IN: "#fce4ff",
  COMPLETED: "#d0ffce",
  NOT_CHECKED_IN: "#ffcfcf",
};

export default function TimeLine({ navigation, route }) {
  const [listCity, setListCity] = useState([]);
  const [citySelected, setCitySelected] = useState({
    id: 1,
    branch: "TP. Hồ Chí Minh",
  });
  const [listRoom, setListRoom] = useState([]);
  const [roomSelected, setRoomSelected] = useState("");
  const { dateSelected } = route?.params;
  const [listScheduleOfRoom, setListScheduleOfRoom] = useState([]);
  let currentSchedule = useRef(null);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const arrTimeScheduleExist = useMemo(() => {
    const arrTimeScheduleExistTemp = [];
    const renderTimeFormat = renderTime().map((item) => item.time);
    if (listScheduleOfRoom.length == 0) return [];
    listScheduleOfRoom.map((item) => {
      const timeStart = item.timeStart.toString().split("T")[1].slice(0, 5);
      const timeEnd = item.timeEnd.toString().split("T")[1].slice(0, 5);

      const indexStart = renderTimeFormat.indexOf(timeStart);
      const indexEnd = renderTimeFormat.indexOf(timeEnd);
      const schedule = renderTimeFormat.slice(indexStart, indexEnd + 1);

      arrTimeScheduleExistTemp.push(schedule);
    });
    return arrTimeScheduleExistTemp;
  }, [listScheduleOfRoom]);

  const fetchCityData = async () => {
    try {
      const res = await axiosConfig().get("/api/v1/location/getAllBranch");
      const formatData = res.data.map((location) => ({
        id: location.branchId,
        branch: location.branchName,
      }));
      setListCity(formatData);
    } catch (err) {
      console.log(err);
    }
  };

  // lấy danh sách phòng
  const fetchRoomByCity = async () => {
    try {
      const res = await axiosConfig().get(
        `api/v1/room/getRoomsByBranch?locationId=${citySelected.id}`
      );
      const formatData = res.data.map((room) => ({
        id: room.roomId,
        roomName: room.roomName,
      }));
      setListRoom(formatData);
    } catch (err) {
      console.log(err);
    }
  };

  // lấy danh sách lịch đặt của phòng theo ngày được chọn
  const fetchScheduleOfRoomByDate = async () => {
    const dayStart = `${dateSelected}T00:00:00.000Z`;
    const dayEnd = `${dateSelected}T23:59:59.999Z`;
    try {
      const res = await axiosConfig().get(
        `/api/v1/room/getRoomOverView?branch=${citySelected.branch}&dayStart=${dayStart}&dayEnd=${dayEnd}`
      );
      const reservationSchedule = res.data.find(
        (schedule) => schedule.roomId == roomSelected.id
      );
      setListScheduleOfRoom(reservationSchedule.reservationViewDTOS);
    } catch (err) {
      console.log(err.message);
    }
  };

  // khởi tạo dữ liệu city
  useEffect(() => {
    fetchCityData();
  }, []);

  // lấy dữ liệu phòng theo thành phố
  useEffect(() => {
    fetchRoomByCity();
  }, [citySelected]);

  // lấy danh sách lịch đặt theo phòng trong ngày được chọn
  useEffect(() => {
    if (roomSelected != "") {
      fetchScheduleOfRoomByDate();
    }
  }, [roomSelected]);

  // check schedule available exist
  const handleFindScheduleExist = (timePin) => {
    const checkTime = arrTimeScheduleExist.some((item) =>
      item.includes(timePin)
    );
    return checkTime;
  };

  const renderScheduleByTimeLine = (timeStart, index) => {
    let duplicated = false;
    const infoSchedule =
      listScheduleOfRoom.length > 0 &&
      listScheduleOfRoom.find(
        (item) =>
          item.timeStart.toString().split("T")[1].slice(0, 5) <= timeStart &&
          timeStart <= item.timeEnd.toString().split("T")[1].slice(0, 5)
      );

    // đổi sang useRef để sử dụng việc render... cần sửa
    if (infoSchedule) {
      if (currentSchedule.current == null) {
        currentSchedule.current = infoSchedule;
      } else {
        duplicated = !(
          currentSchedule.current.reservationId == infoSchedule.reservationId &&
          timeStart ==
            infoSchedule.timeStart.toString().split("T")[1].slice(0, 5)
        );
        if (
          currentSchedule.current.reservationId != infoSchedule.reservationId
        ) {
          currentSchedule.current = infoSchedule;
          duplicated = false;
        }
      }

      return (
        <View
          style={{
            width: "75%",
            height: "100%",
            backgroundColor: backgroundSchedule[infoSchedule.statusReservation],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {duplicated == false ? (
            <>
              <Text
                style={[
                  styles.labelInputContentItem,
                  {
                    textAlignVertical: "center",
                    height: "50%",
                  },
                ]}
              >
                {infoSchedule.title}
              </Text>
              <Text
                style={[
                  styles.labelNotCheck,
                  {
                    marginTop: 5,
                    textAlign: "center",
                    color: "#c31818",
                    textAlignVertical: "center",
                    height: "30%",
                  },
                ]}
              >
                {statusRoom[infoSchedule.statusReservation]}
              </Text>
            </>
          ) : (
            <></>
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "75%",
            height: "100%",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: "#ccc",
            borderBottomColor: "#ccc",
            paddingVertical: Platform.OS == "ios" ? 30 : 0,
          }}
        >
          <Text style={[styles.labelNotCheck, { textAlignVertical: "center" }]}>
            Chưa có lịch
          </Text>
        </View>
      );
    }
  };

  return (
    <DefaultLayout>
      <Header
        leftIcon={"chevron-left"}
        handleOnPressLeftIcon={() => navigation.goBack("")}
        nameScreen={"TimeLine"}
      />
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.contentItem, { width: "48%" }]}>
            <Text style={styles.labelInputContentItem}>Chọn thành phố</Text>
            {listCity.length > 0 && (
              <DropdownCustom
                data={listCity}
                value={citySelected.id}
                handleOnChange={(item) => {
                  setCitySelected(item);
                }}
                labelOfValue={"branch"}
                valueField={"id"}
                nameIcon="location-city"
                isVisibleSearch={false}
                placeholder={"Chọn thành phố"}
              />
            )}
          </View>
          <View style={[styles.contentItem, { width: "48%" }]}>
            <Text style={styles.labelInputContentItem}>Chọn phòng</Text>
            {listCity.length > 0 && (
              <DropdownCustom
                data={listRoom}
                value={roomSelected.id}
                handleOnChange={(item) => {
                  setRoomSelected(item);
                }}
                labelOfValue={"roomName"}
                valueField={"id"}
                nameIcon="meeting-room"
                isVisibleSearch={false}
                placeholder={"Chọn phòng"}
              />
            )}
          </View>
        </View>
        <View
          style={[
            styles.contentItem,
            {
              height: "auto",
            },
          ]}
        >
          <Text style={styles.labelInputContentItem}>Chọn mốc thời gian</Text>
          <FlatList
            data={renderTime()}
            contentContainerStyle={{ paddingBottom: 400 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: 80,
                }}
                onPress={() => {
                  if (roomSelected != "") {
                    if (!handleFindScheduleExist(item.time)) {
                      navigation.navigate("InfoRoomRegister", {
                        infoRoom: {
                          roomId: roomSelected.id,
                          roomName: roomSelected.roomName,
                          timeStartBeChoose: item.time,
                          dateSelected,
                        },
                      });
                    } else {
                      console.log("Vào");
                      Toast.show({
                        type: "error",
                        text1: "Thông báo",
                        text2: "Lịch đã được đặt!!!",
                        text1Style: {
                          fontSize: 18,
                          fontWeight: "bold",
                          textAlign: "left",
                          color: "#c31818",
                        },
                        text2Style: {
                          fontSize: 14,
                          fontWeight: "400",
                          textAlign: "left",
                        },
                      });
                    }
                  } else {
                    setIsOpenPopup(true);
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    width: "25%",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: "#ccc",
                    borderBottomColor: "#ccc",
                    textAlignVertical: "center",
                    paddingVertical: Platform.OS == "ios" ? 30 : 0,
                  }}
                >
                  {item.time}
                </Text>
                {listScheduleOfRoom &&
                  renderScheduleByTimeLine(item.time, index)}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.time.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Popup
        isOpen={isOpenPopup}
        title={"Thống báo"}
        status={"warning"}
        content={"Vui lòng chọn phòng trước khi chọn mốc thời gian"}
        titleButtonAccept={"OK"}
        handleOnPopup={() => setIsOpenPopup(false)}
      />
      <Toast />
    </DefaultLayout>
  );
}
