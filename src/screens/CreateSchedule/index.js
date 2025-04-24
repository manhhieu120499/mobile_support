import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { CardRoom, ModalSideBar } from "../../components";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  renderTime,
  axiosConfig,
  findTimeFitToRegisterRoom,
} from "../../utilities";
import { useDebounce } from "../../hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  containerFilterSearch: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    height: 38,
  },
  inputContainerFilterSearch: {
    height: "100%",
    paddingLeft: 12,
    width: "80%",
  },
  btnSearchInContainerFilterSearch: {
    width: "15%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#afb2b7",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  containerListRoom: {
    width: "100%",
    paddingHorizontal: 10,
  },
});

// data default
const dataHeaderCreateSchedule = [
  {
    name: "Chi nhánh",
  },
  {
    name: "Ngày",
  },
  {
    name: "Thời gian bắt đầu",
  },
  {
    name: "Thời gian họp",
  },
  {
    name: "Sức chứa",
  },
];

// calculator time end when know timeStart
const calculatorTimeEnd = (timeStart, timeEnd, selectedDate) => {
  const times = renderTime();
  const duration = timeEnd.split(" ")[0];
  const indexTimeStart = times.findIndex((t) => t.time == timeStart);
  const indexTimeEnd = indexTimeStart + Number.parseInt(duration / 30);
  return new Date(`${selectedDate}T${`${times[indexTimeEnd].time}:00`}`);
};

export default function CreateSchedule({ navigation, route }) {
  const [branchValue, setBranchValue] = useState("TP. Hồ Chí Minh");
  const [timeStart, setTimeStart] = useState(() => {
    return findTimeFitToRegisterRoom();
  });
  const [capacity, setCapacity] = useState("1");
  const [timeEnd, setTimeEnd] = useState("30 phút");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [roomsData, setRoomsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [inputSearch, setInputSearch] = useState("");
  const debounceValue = useDebounce(inputSearch, 200);
  const [roomsDataDefault, setRoomsDataDefault] = useState([]);

  // info push modal
  const branchOption = {
    branchValue,
    setBranchValue,
  };

  const timeStartOption = {
    timeStart,
    setTimeStart,
  };

  const timeEndOption = {
    timeEnd,
    setTimeEnd,
  };

  const capacityOption = {
    capacity,
    setCapacity,
  };

  const selectedDateOption = {
    selectedDate,
    setSelectedDate,
  };

  // fetch data
  const fetchRoomData = async () => {
    try {
      const timeStartFormat =
        timeStart != ""
          ? new Date(`${selectedDate}T${`${timeStart}:00`}`).toISOString()
          : "";
      const timeEndFormat =
        timeEnd != ""
          ? calculatorTimeEnd(timeStart, timeEnd, selectedDate).toISOString()
          : "";

      const res = await axiosConfig().get(
        `/api/v1/room/searchRoomByAttribute?capacity=${Number.parseInt(
          capacity
        )}&timeStart=${timeStartFormat}&timeEnd=${timeEndFormat}&branch=${branchValue}`
      );

      setRoomsData((prev) => [...res.data]);
      setRoomsDataDefault(res.data);
    } catch (err) {
      console.log(err.response.message);
    }
  };

  // call rooms data first time
  useEffect(() => {
    fetchRoomData();
  }, [timeStart, timeEnd, branchValue, capacity, selectedDate]);

  // filter when search
  useEffect(() => {
    if (debounceValue == "") {
      fetchRoomData();
    } else {
      const regex = new RegExp(debounceValue, "giu");
      setRoomsData((prev) =>
        roomsDataDefault.filter((room) => room.roomName.match(regex))
      );
    }
  }, [debounceValue]);

  // lưu tạm thông tin userCurrent
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axiosConfig().get(
  //         "/api/v1/employee/getEmployeeByPhone?phone=0914653334"
  //       );
  //       await AsyncStorage.setItem("current_user", JSON.stringify(res.data));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  // }, []);

  // tính thời gian timeEnd by duration
  const handleCalculatorTimeEndByDuration = (timeStart, duration = 30) => {
    const formatDuration = Number.parseInt(duration) / 10;
    const indexTimeStart = renderTime().findIndex(
      (item) => item.time == timeStart
    );
    return renderTime()[indexTimeStart + formatDuration].time;
  };

  // xử lý chuyển đến trang đặt phòng
  const handleTransferScreenRegisterRoom = ({ roomItem }) => {
    navigation.navigate("InfoRoomRegister", {
      infoRoom: roomItem,
      timeStartChooseRegisterCurrent: timeStart,
      dayStartChoose: selectedDate,
      timeEndChooseCurrent: handleCalculatorTimeEndByDuration(
        timeStart,
        timeEnd
      ),
    });
  };

  return (
    <DefaultLayout>
      <Header
        leftIcon={"menu"}
        rightIcon={"bell"}
        handleOnPressLeftIcon={() => setIsOpenModal(true)}
      >
        <View style={style.containerFilterSearch}>
          <TextInput
            placeholder="Nhập tên phòng..."
            style={style.inputContainerFilterSearch}
            onChangeText={(text) => setInputSearch(text)}
          />
          <Pressable style={style.btnSearchInContainerFilterSearch}>
            <MaterialIcons name="search" size={26} color={"white"} />
          </Pressable>
        </View>
      </Header>
      <View style={style.container}>
        <View
          style={{
            flexDirection: "row",
            height: 80,
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              width: 120,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2296f3",
              borderRadius: 10,
              flexDirection: "row",
              gap: 5,
            }}
            onPress={() => navigation.navigate("QRScan")}
          >
            <MaterialIcons name="qr-code-scanner" size={20} color={"white"} />
            <Text
              style={{
                color: "white",
                fontSize: 16,

                textDecorationLine: "underline",
              }}
            >
              Check-in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              minWidth: 180,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2296f3",
              borderRadius: 10,
              flexDirection: "row",
              gap: 5,
            }}
            onPress={() => navigation.navigate("Schedule")}
          >
            <MaterialIcons name="calendar-month" size={20} color={"white"} />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textDecorationLine: "underline",
              }}
            >
              Đặt lịch theo ngày
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.containerListRoom}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Danh sách phòng
          </Text>
          {roomsData.length > 0 ? (
            <ScrollView
              style={{ marginTop: 10 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 350 }}
            >
              {roomsData.length != 0 &&
                roomsData.map((roomItem) => (
                  <CardRoom
                    key={roomItem.roomId}
                    roomInfo={roomItem}
                    handleRegisterRoom={() =>
                      handleTransferScreenRegisterRoom({ roomItem })
                    }
                    handleViewDetailRoom={() =>
                      navigation.navigate("RoomDetail", { room: roomItem })
                    }
                  />
                ))}
            </ScrollView>
          ) : (
            <View
              style={{
                width: "100%",
                height: 300,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, textAlign: "center", fontWeight: "500" }}
              >
                Không tìm thấy phòng...
              </Text>
            </View>
          )}
        </View>
      </View>

      <ModalSideBar
        branchOption={branchOption}
        timeStartOption={timeStartOption}
        capacityOption={capacityOption}
        timeEndOption={timeEndOption}
        selectedDateOption={selectedDateOption}
        onCloseModal={() => setIsOpenModal(false)}
        isVisible={isOpenModal}
      />
    </DefaultLayout>
  );
}
