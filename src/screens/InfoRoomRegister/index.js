import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import {
  axiosConfig,
  formatTime,
  getAllDayBetweenDayStartAndDayEnd,
  renderTime,
  uploadImageToCloudinary,
  findTimeFitToRegisterRoom,
  formatDayOfWeek,
} from "../../utilities";
import {
  CalendarCustom,
  DropdownCustom,
  ModalCalendar,
  ModalServe,
  ModalTime,
  Popup,
} from "../../components";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
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
  },
  inputContent: {
    height: "100%",
    fontSize: 15,
  },
});

const frequencyData = [
  { frequency: "MỘT LẦN" },
  { frequency: "MỖI NGÀY" },
  { frequency: "MỖI TUẦN" },
];

// format frequency
const formatFrequency = (name) => {
  switch (name) {
    case "MỘT LẦN": {
      return "ONE_TIME";
    }
    case "MỖI NGÀY": {
      return "DAILY";
    }
    case "MỖI TUẦN": {
      return "WEEKLY";
    }
  }
};

// xử lý cập nhật giờ kết thúc theo giờ bắt đầu
const handleUpdateTimeEndByTimeStart = (time, distance = 3) => {
  const timesOriginal = renderTime();
  const indexTimeStart = timesOriginal.findIndex((t) => t.time == time);
  return timesOriginal.slice(indexTimeStart + distance, timesOriginal.length);
};

export default function InfoRoomRegister({ navigation, route }) {
  const {
    roomId,
    roomName,
    timeStartBeChoose = "",
    capacity = 0,
  } = route?.params?.infoRoom != undefined
    ? route.params.infoRoom
    : { roomId: "", roomName: "", timeStartBeChoose: "" };
  const {
    timeStartChooseRegisterCurrent,
    dayStartChoose,
    timeEndChooseCurrent,
  } = route?.params;

  // params ở trang room detail
  const { statusCheckTime = null } = route?.params;

  const [roomSelected, setRoomSelected] = useState(roomId);
  const [booker, setBooker] = useState({});
  const [listServices, setListService] = useState([]);
  const [titleMeeting, setTitleMeeting] = useState("");
  const [timeStart, setTimeStart] = useState(() => findTimeFitToRegisterRoom());
  const [timeEnd, setTimeEnd] = useState("7:30");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("MỘT LẦN");
  const [listDocument, setListDocument] = useState([]);
  const [listParticipant, setListParticipant] = useState([]);
  const [listSelectedParticipantRender, setListSelectedParticipantRender] =
    useState([]);
  const [listSelectedServiceRender, setListSelectedServiceRender] = useState(
    []
  );
  const [isEditTimeEnd, setIsEditTimeEnd] = useState(false);
  const [timeEndFilterByTimeStart, setTimeEndFilterByTimeStart] = useState(() =>
    renderTime()
  );
  const [dayStart, setDayStart] = useState(
    route?.params?.infoRoom?.dateSelected ??
      new Date().toISOString().split("T")[0]
  );
  const [dayEnd, setDayEnd] = useState(
    route?.params?.infoRoom?.dateSelected ??
      new Date().toISOString().split("T")[0]
  );
  const [timeFinishFrequency, setTimeFinishFrequency] = useState([]);
  const [listWeekOfDayRender, setListWeekOfDayRender] = useState([]);

  // state đóng mở modal
  const [isOpenModalDayStart, setIsOpenModalDayStart] = useState(false);
  const [isOpenModalDayEnd, setIsOpenModalDayEnd] = useState(false);
  const [isOpenModalRemoveDay, setIsOpenModalRemoveDay] = useState(false);
  const [isOpenModalRemoveWeekOfDay, setIsOpenModalRemoveWeekOfDay] =
    useState(false);
  const [isOpenModalNotification, setIsOpenModalNotification] = useState(false);
  const [isOpenModalDrink, setIsOpenModalDrink] = useState(false);
  const [isOpenModalSelectedParticipant, setIsOpenModalSelectedParticipant] =
    useState(false);
  const [isOpenModalRemoveDayOfWeek, setIsOpenModalRemoveDayOfWeek] =
    useState(false);
  const [
    isOpenModalDetailDuplicatedSchedule,
    setIsOpenModalDetailDuplicatedSchedule,
  ] = useState(false);

  // state remove day or weekOfDay
  const [daySelectedRemove, setDaySelectedRemove] = useState([]); // tần suất mỗi ngày (ngày bị loại bỏ)
  const [weekOfDaySelectRemove, setWeekOfDaySelectedRemove] = useState([]); // tần suất mỗi ngày (thứ bị loại bỏ)
  const [dayOfWeekSelectRemove, setDayOfWeekSelectRemove] = useState([]); // tần suất mỗi tuần

  // state remove drink or participant
  const [drinkSelectedRemove, setDrinkSelectedRemove] = useState([]);
  const [participantSelectRemove, setParticipantSelectedRemove] = useState([]);

  // state active cho loại bỏ ngày và loại bỏ thứ
  const [isActiveRemoveDay, setIsActiveRemoveDay] = useState(false);
  const [isActiveRemoveWeekOfDay, setIsActiveRemoveWeekOfDay] = useState(false);

  // state loading khi xử lý yêu cầu
  const [loading, setLoading] = useState(true);
  // state message for notification event
  const [message, setMessage] = useState({
    body: "",
    status: "",
    reason: "",
  });

  // state duplicated schedule
  const [listDuplicatedSchedule, setListDuplicatedSchedule] = useState([]);

  // state render time start for register room in view detail
  const [arrTimeStartRender, setArrTimeStartRender] = useState(() => {
    return renderTime().slice(0, renderTime().length - 3);
  });

  // kiểm tra xem đã quá giờ hay chưa
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (dayStartChoose == new Date().toISOString().split("T")[0]) {
        if (timeStart == "18:00" || timeStart == "0") {
          Alert.alert(
            "Thông báo",
            "Đã hết giờ để đặt phòng, vui lòng trở lại vào ngày hôm sau",
            [
              {
                text: "OK",
                onPress: () => navigation.goBack(""),
              },
            ]
          );
        }
      }
    }, 0);
    return () => clearTimeout(timeOut);
  }, []);

  // dành cho việc đặt lịch phòng theo ngày (render thời gian)
  useEffect(() => {
    if (timeStartBeChoose != "") {
      setTimeStart(timeStartBeChoose);
      setTimeEndFilterByTimeStart(
        handleUpdateTimeEndByTimeStart(timeStartBeChoose)
      );
      setTimeEnd(handleUpdateTimeEndByTimeStart(timeStartBeChoose)[0].time);
    } else {
      if (statusCheckTime != null) {
        if (statusCheckTime) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          setDayStart(tomorrow.toISOString().split("T")[0]);
          setDayEnd(tomorrow.toISOString().split("T")[0]);
          setTimeStart("07:00");
          setTimeEndFilterByTimeStart(handleUpdateTimeEndByTimeStart("07:00"));
          setTimeEnd(handleUpdateTimeEndByTimeStart("07:00")[0].time);
        } else {
          // nếu là ngày hiện tại
          const indexTimeStart = renderTime().findIndex(
            (item) => item.time == findTimeFitToRegisterRoom()
          );
          setTimeStart(findTimeFitToRegisterRoom());
          setArrTimeStartRender(
            renderTime().slice(indexTimeStart, renderTime().length - 3)
          );
          setTimeEndFilterByTimeStart(
            handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom())
          );
          setTimeEnd(
            handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom())[0].time
          );
        }
      }
    }
  }, []);

  // dành cho việc đặt lịch ngay cho phòng
  useEffect(() => {
    if (dayStartChoose) {
      if (dayStartChoose == new Date().toISOString().split("T")[0]) {
        setTimeStart(findTimeFitToRegisterRoom());
        setTimeEndFilterByTimeStart((prev) => [
          ...handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom()),
        ]);
        setTimeEnd(
          handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom())[0].time
        );
      } else {
        setTimeEnd(timeEndChooseCurrent);
        setTimeEndFilterByTimeStart((prev) => {
          const indexTimeEnd = renderTime().findIndex(
            (item) => item.time == timeEndChooseCurrent
          );
          return renderTime().slice(indexTimeEnd, renderTime().length);
        });
        setTimeStart(timeStartChooseRegisterCurrent);
      }
      setDayStart(dayStartChoose);
      setDayEnd(dayStartChoose);
    }
  }, []);

  const fetchServiceData = async () => {
    try {
      const res = await axiosConfig().get("/api/v1/service/getAllServices");
      const formatData = res.data.map((drink) => ({
        id: drink.serviceId,
        name: drink.serviceName,
      }));
      setListService(formatData);
    } catch (err) {
      console.log(err.response);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const [res, userJson] = await Promise.all([
        axiosConfig().get("/api/v1/employee/getAllEmployee"),
        AsyncStorage.getItem("userCurrent"),
      ]);
      const user = JSON.parse(userJson);
      const formatData = res.data
        .map((emp) => ({
          empId: emp.employeeId,
          name: emp.employeeName,
          phone: emp.phone,
        }))
        .filter((emp) => emp.phone != user.phone);

      setListParticipant(formatData);
      setBooker(user);
      listSelectedParticipantRender.length == 0 &&
        setListSelectedParticipantRender((prev) => [
          ...prev,
          {
            empId: user.employeeId,
            name: user.employeeName,
            phone: user.phone,
          },
        ]);
    } catch (err) {
      console.log(err.response);
    }
  };

  // lấy danh sách dịch vụ
  useEffect(() => {
    fetchServiceData();
    fetchEmployeeData();
  }, []);

  // xử lý render lại giờ kết thúc
  // useEffect(() => {
  //   setTimeEndFilterByTimeStart((prev) => [
  //     ...handleUpdateTimeEndByTimeStart(timeStart),
  //   ]);
  //   setTimeEnd(handleUpdateTimeEndByTimeStart(timeStart)[0].time); // cập nhật time end trong lần đầu tiên khởi tạo
  // }, [timeStart]);

  // xử lý chọn ảnh từ thư viện
  const handleChooseImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setListDocument((prev) => [...prev, { file: result.assets[0].uri }]);
    }
  };

  // validate dữ liệu
  const handleValidateData = () => {
    if (titleMeeting == "" || titleMeeting == " ") {
      Alert.alert("Thống báo", "Vui lòng nhập tiêu đề cuộc họp");
      return false;
    }
    if (listSelectedParticipantRender.length < 2) {
      Alert.alert(
        "Thông báo",
        "Số lượng người tham gia tối thiểu là 2 người. Vui lòng chọn thêm!"
      );
      return false;
    }
    return true;
  };

  // xử lý gửi phê duyệt yêu cầu đặt phòng
  const handleRequestReservationRoom = async () => {
    const isValidate = handleValidateData();
    if (isValidate) {
      setLoading(true);
      setIsOpenModalNotification(true);
      try {
        // upload ảnh lên cloudinary
        const resImages = [];
        for (const file of listDocument) {
          try {
            const { data, status, message } = await uploadImageToCloudinary(
              file.file
            );
            if (status === "success") {
              resImages.push(data);
            } else {
              throw new Error(message || "Lỗi không xác định khi tải ảnh");
            }
          } catch (err) {
            console.log("Lỗi upload ảnh:", err);
            setMessage({
              body: "Thông báo \nGửi yêu cầu thất bại. Vui lòng kiểm tra lại kết nối mạng",
              status: "err",
              typePopup: "small",
            });
          }
        }

        // gửi request đặt phòng
        const requestData = {
          timeRequest: new Date().toISOString(),
          typeRequestForm:
            formatFrequency(frequency) == "ONE_TIME"
              ? "RESERVATION_ONETIME"
              : "RESERVATION_RECURRING",
          reservationDTO: {
            time: formatTime(new Date().toISOString().split("T")[0], "00:00"),
            timeStart: formatTime(dayStart, timeStart),
            timeEnd: formatTime(dayStart, timeEnd),
            note,
            description,
            title: titleMeeting,
            frequency: formatFrequency(frequency),
            bookerId: booker.employeeId,
            roomId: roomSelected,
            employeeIds: listSelectedParticipantRender.map(
              (item) => item.empId
            ),
            serviceIds: listSelectedServiceRender.map((item) => item.id),
            filePaths: [...resImages],
            timeFinishFrequency: [...timeFinishFrequency],
          },
        };

        const res = await axiosConfig().post(
          "/api/v1/requestForm/createRequestForm",
          requestData
        );
        if (res.status === 200) {
          setMessage({
            body: "Gửi phê duyệt thành công",
            status: "success",
            reason: "",
          });
        }
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 400) {
          console.log(err.response.data);
          const arrMessage = err.response.data
            .map((item) => {
              const infoDuplicate = {
                title: item.title,
                dateDuplicated: item.timeStart.toString().split("T")[0],
                start: item.timeStart.toString().split("T")[1].slice(0, 5),
                end: item.timeEnd.toString().split("T")[1].slice(0, 5),
              };
              return `${infoDuplicate.title} - thời gian: ${infoDuplicate.start} - ${infoDuplicate.end}`;
            })
            .slice(0, 2)
            .join("\n");
          setListDuplicatedSchedule(
            err.response.data.map((item) => {
              return {
                dateDuplicated: item.timeStart.toString().split("T")[0],
                timeStart: item.timeStart.toString().split("T")[1].slice(0, 5),
                timeEnd: item.timeEnd.toString().split("T")[1].slice(0, 5),
              };
            })
          );
          setMessage({
            body: `Trùng lịch\n${arrMessage}`,
            status: "error",
            reason: "duplicated",
          });
        } else {
          console.log(err);
          setMessage({
            body: "Gửi phê duyệt thất bại.\nVui lòng kiểm tra lại thông tin hoặc đường truyền mạng",
            status: "error",
            reason: "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // xử lý remove day or day of week or week of the day
  const handleRemoveItemTime = (item, flag, type) => {
    switch (type) {
      case "DAY": {
        // loại bỏ ngày theo tần suất mỗi ngày
        if (flag) setDaySelectedRemove((prev) => [...prev, item]);
        else
          setDaySelectedRemove((prev) =>
            prev.filter((dayItem) => dayItem == item)
          );
      }
      case "WEEKOFDAY": {
        // loại bỏ thứ trong tuần theo tần suất mỗi ngày
        if (flag) setWeekOfDaySelectedRemove((prev) => [...prev, item]);
        else
          setWeekOfDaySelectedRemove((prev) =>
            prev.filter((weekOfDayItem) => weekOfDayItem == item)
          );
      }
      case "DAYOFWEEK": {
        // loại bỏ thứ theo tuần dựa trên tần suất mỗi tuần
        if (flag) setDayOfWeekSelectRemove((prev) => [...prev, item]);
        else
          setDayOfWeekSelectRemove((prev) =>
            prev.filter((weekOfDayItem) => weekOfDayItem == item)
          );
      }
    }
  };

  // xử lý modal chọn ngày bắt đầu
  const handleDayOnModalDayStart = (selectedDate) => {
    setDayStart(selectedDate);
    if (formatFrequency(frequency) == "ONE_TIME") setDayEnd(selectedDate);
    if (selectedDate != new Date().toISOString().split("T")[0]) {
      setTimeStart("07:00");
      setArrTimeStartRender(renderTime().slice(0, renderTime().length - 3));
      setTimeEndFilterByTimeStart(handleUpdateTimeEndByTimeStart("07:00"));
      setTimeEnd(handleUpdateTimeEndByTimeStart("07:00")[0].time);
    } else {
      setTimeStart(findTimeFitToRegisterRoom());
      setTimeEndFilterByTimeStart(
        handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom())
      );
      setTimeEnd(
        handleUpdateTimeEndByTimeStart(findTimeFitToRegisterRoom())[0].time
      );
    }
    setIsOpenModalDayStart(false);
  };

  // xử lý modal chọn ngày kết thúc
  const handleDayOnModalDayEnd = (selectedDate) => {
    setDayEnd(selectedDate);
    setIsOpenModalDayEnd(false);
    if (formatFrequency(frequency) == "DAILY") {
      setTimeFinishFrequency([
        ...getAllDayBetweenDayStartAndDayEnd(dayStart, selectedDate),
      ]);
    } else if (formatFrequency(frequency) == "WEEKLY") {
      const dayOfWeekByStartDate = new Date(dayStart).toString().split(" ")[0];
      const timeFinishFrequencyTemp = getAllDayBetweenDayStartAndDayEnd(
        dayStart,
        selectedDate
      ).filter(
        (timeItem) =>
          new Date(timeItem).toString().split(" ")[0] == dayOfWeekByStartDate
      );
      setTimeFinishFrequency([...timeFinishFrequencyTemp]);
    }
  };

  // xử lý xác nhận remove item
  const handleAcceptedRemoveItemCustom = (
    updateOriginalState,
    updateSelectedState,
    updateStatusModal,
    updateActiveButton = undefined,
    arrItemBeRemove
  ) => {
    updateOriginalState((prev) =>
      prev.filter((item) => !arrItemBeRemove.includes(item))
    );
    updateSelectedState([]);
    updateStatusModal(false);
    updateActiveButton != undefined && updateActiveButton(true);
  };

  // xử lý xác nhận remove item for time, service, participant
  const handleAcceptedRemoveItem = (type) => {
    switch (type) {
      case "DAY": {
        handleAcceptedRemoveItemCustom(
          setTimeFinishFrequency,
          setDaySelectedRemove,
          setIsOpenModalRemoveDay,
          setIsActiveRemoveWeekOfDay,
          daySelectedRemove
        );
        break;
      }
      case "WEEKOFDAY": {
        setTimeFinishFrequency((prev) =>
          prev.filter(
            (item) =>
              !weekOfDaySelectRemove.includes(
                formatDayOfWeek(item.toString().split(" ")[0])
              )
          )
        );
        setWeekOfDaySelectedRemove((prev) => []);
        setIsOpenModalRemoveWeekOfDay(false);
        setIsActiveRemoveDay(true);
        break;
      }
      case "DAYOFWEEK": {
        handleAcceptedRemoveItemCustom(
          setTimeFinishFrequency,
          setDayOfWeekSelectRemove,
          setIsOpenModalRemoveDayOfWeek,
          undefined, // truyền undefine bởi vì không có hành động active button
          dayOfWeekSelectRemove
        );
        break;
      }
      case "DRINK": {
        handleAcceptedRemoveItemCustom(
          setListSelectedServiceRender,
          setDrinkSelectedRemove,
          setIsOpenModalDrink,
          undefined, // truyền undefine bởi vì không có hành động active button
          drinkSelectedRemove
        );
        break;
      }
      case "PARTICIPANT": {
        handleAcceptedRemoveItemCustom(
          setListSelectedParticipantRender,
          setParticipantSelectedRemove,
          setIsOpenModalSelectedParticipant,
          undefined, // truyền undefine bởi vì không có hành động active button
          participantSelectRemove
        );
        break;
      }
    }
  };

  // xử lý remove drink
  const handleRemoveDrink = (item, flag) => {
    if (flag) setDrinkSelectedRemove((prev) => [...prev, item]);
    else
      setDrinkSelectedRemove((prev) =>
        prev.filter((drinkItem) => drinkItem == item)
      );
  };

  // xử lý remove participant
  const handleRemoveParticipant = (item, flag) => {
    if (flag) {
      if (item.empId != booker.employeeId)
        setParticipantSelectedRemove((prev) => [...prev, item]);
      else
        Alert.alert(
          "Thông báo",
          "Đây là người đặt phòng nên không thể xóa!!!. Vui lòng bỏ chọn"
        );
    } else {
      setParticipantSelectedRemove((prev) =>
        prev.filter((participantItem) => participantItem == item)
      );
    }
  };

  return (
    <DefaultLayout>
      <Header
        leftIcon={"chevron-left"}
        nameScreen={"inforoomregister"}
        handleOnPressLeftIcon={() => navigation.goBack("")}
      />
      <ScrollView
        style={style.container}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Chọn phòng</Text>
            <View style={style.inputInContentItem}>
              <TextInput
                placeholder="Chọn phòng"
                value={roomName}
                style={style.inputContent}
                editable={false}
              />
            </View>
          </View>
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Ngày</Text>
            <View
              style={[
                style.inputInContentItem,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextInput
                placeholder="Nhập ngày"
                value={dayStart}
                style={style.inputContent}
                editable={false}
              />
              <TouchableOpacity
                style={{
                  width: "15%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: "100%",
                }}
                onPress={() => setIsOpenModalDayStart(true)}
                disabled={
                  route?.params?.infoRoom?.dateSelected || dayStartChoose
                    ? true
                    : false
                }
              >
                <FontAwesomeIcon
                  name="calendar"
                  size={20}
                  style={{ textAlign: "right" }}
                  color={"black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tiêu đề</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập tiêu đề"
              value={titleMeeting}
              style={style.inputContent}
              onChangeText={(text) => setTitleMeeting(text)}
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Giờ bắt đầu</Text>

            <DropdownCustom
              data={arrTimeStartRender}
              value={timeStart}
              handleOnChange={(item) => {
                setTimeStart(item.time);
                setTimeEndFilterByTimeStart(
                  handleUpdateTimeEndByTimeStart(item.time)
                );
                setTimeEnd(handleUpdateTimeEndByTimeStart(item.time)[0].time);
                setIsEditTimeEnd(false);
              }}
              labelOfValue={"time"}
              valueField={"time"}
              nameIcon="punch-clock"
              isDisable={
                dayStart == new Date().toISOString().split("T")[0] ||
                timeStartBeChoose != "" ||
                timeEndChooseCurrent
              }
            />
          </View>
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Giờ kết thúc</Text>

            <DropdownCustom
              data={timeEndFilterByTimeStart}
              value={timeEndFilterByTimeStart[0]}
              handleOnChange={(item) => {
                setTimeEnd(item.time);
              }}
              labelOfValue={"time"}
              valueField={"time"}
              nameIcon="punch-clock"
              isDisable={timeEndChooseCurrent ? true : isEditTimeEnd}
            />
          </View>
        </View>

        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Ghi chú</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập ghi chú"
              value={note}
              style={style.inputContent}
              onChangeText={(text) => setNote(text)}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Mô tả</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập mô tả"
              value={description}
              style={style.inputContent}
              multiline={true}
              numberOfLines={3}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Tần suất</Text>

            <DropdownCustom
              data={frequencyData}
              value={frequency}
              handleOnChange={(item) => {
                setFrequency(item.frequency);
                setTimeFinishFrequency((prev) => []);
                setIsActiveRemoveDay(false);
                setIsActiveRemoveWeekOfDay(false);
              }}
              labelOfValue={"frequency"}
              nameIcon="punch-clock"
            />
          </View>
          <View style={[style.contentItem, { width: "48%" }]}>
            <Text style={style.labelInputContentItem}>Ngày kết thúc</Text>
            <View
              style={[
                style.inputInContentItem,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextInput
                placeholder="Nhập ngày"
                value={dayEnd}
                style={style.inputContent}
                editable={false}
              />
              <TouchableOpacity
                style={{
                  width: "15%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: "100%",
                }}
                onPress={() => setIsOpenModalDayEnd(true)}
                disabled={frequency == "MỘT LẦN" ? true : false}
              >
                <FontAwesomeIcon
                  name="calendar"
                  size={20}
                  style={{ textAlign: "right" }}
                  color={"black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {formatFrequency(frequency) == "DAILY" &&
          timeFinishFrequency.length > 0 && (
            <View
              style={[
                style.contentItem,
                {
                  flexDirection: "row",
                  backgroundColor: "white",
                  height: 50,
                  alignItems: "center",
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 8,
                  borderColor: "#e7e7e7",
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    isActiveRemoveDay == false ? "#003b95" : "gray",
                }}
                onPress={() => setIsOpenModalRemoveDay(true)}
                disabled={isActiveRemoveDay}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Loại bỏ ngày
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 8,
                  borderColor: "#e7e7e7",
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    isActiveRemoveWeekOfDay == false ? "#003b95" : "gray",
                }}
                disabled={isActiveRemoveWeekOfDay}
                onPress={() => {
                  const listTemp = [];
                  timeFinishFrequency.map((item) => {
                    if (listTemp.length <= 0) {
                      listTemp.push(
                        formatDayOfWeek(item.toString().split(" ")[0])
                      );
                    } else {
                      if (
                        listTemp.indexOf(
                          formatDayOfWeek(item.toString().split(" ")[0])
                        ) == -1
                      ) {
                        listTemp.push(
                          formatDayOfWeek(item.toString().split(" ")[0])
                        );
                      }
                    }
                  });
                  setListWeekOfDayRender((prev) => [...listTemp]);
                  setIsOpenModalRemoveWeekOfDay(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Loại bỏ thứ
                </Text>
              </TouchableOpacity>
            </View>
          )}
        {formatFrequency(frequency) == "WEEKLY" &&
          timeFinishFrequency.length > 0 && (
            <View
              style={[
                style.contentItem,
                {
                  flexDirection: "row",
                  backgroundColor: "white",
                  height: 50,
                  alignItems: "center",
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 8,
                  borderColor: "#e7e7e7",
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#003b95",
                }}
                onPress={() => setIsOpenModalRemoveDayOfWeek(true)}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Loại bỏ thứ
                </Text>
              </TouchableOpacity>
            </View>
          )}
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tài liệu</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "70%" }}>
              <DropdownCustom
                data={listDocument}
                value={""}
                handleOnChange={() => {}}
                labelOfValue={"file"}
                nameIcon="file-present"
                isVisibleSearch={false}
                placeholder={
                  listDocument.length > 0
                    ? listDocument.map((item) => item.file).join(",")
                    : "File đính kèm"
                }
              />
            </View>
            <TouchableOpacity
              style={{
                width: 90,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#003b95",
                borderRadius: 8,
              }}
              onPress={handleChooseImageFromLibrary}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Tải lên</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[style.contentItem, { height: 180 }]}>
          <View style={style.contentItem}>
            <Text style={style.labelInputContentItem}>Dịch vụ</Text>
            {/** danh sách dịch vụ hiển thị */}
            <DropdownCustom
              data={listServices}
              value={""}
              handleOnChange={(item) => {
                const { id, name } = item;
                if (
                  !listSelectedServiceRender.find(
                    (itemService) => itemService.id == id
                  )
                )
                  setListSelectedServiceRender((prev) => [
                    ...prev,
                    { id, name },
                  ]);
                else {
                  Alert.alert(
                    "Thông báo",
                    "Dịch vụ này đã thêm vào danh sách!"
                  );
                  return;
                }
              }}
              labelOfValue={"name"}
              valueField={"id"}
              nameIcon="room-service"
              placeholder={"Chọn dịch vụ"}
            />
          </View>

          <View style={style.contentItem}>
            <Text style={style.labelInputContentItem}>
              Danh sách dịch vụ được chọn
            </Text>
            <View
              style={[
                style.contentItem,
                {
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <View style={{ width: "68%" }}>
                {/** danh sách dịch vụ được chọn */}
                <DropdownCustom
                  data={listSelectedServiceRender}
                  value={"Dịch vụ được chọn"}
                  handleOnChange={() => {}}
                  labelOfValue={"name"}
                  valueField={"id"}
                  nameIcon="room-service"
                  isVisibleSearch={false}
                  placeholder={listSelectedServiceRender
                    .map((item) => item.name)
                    .join(",")}
                />
              </View>

              {listSelectedServiceRender.length > 0 && (
                <TouchableOpacity
                  style={{
                    width: "28%",
                    height: "40",
                    backgroundColor: "#003b95",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => setIsOpenModalDrink(true)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Tùy chỉnh
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={[style.contentItem, { height: 180 }]}>
          <View style={style.contentItem}>
            <Text style={style.labelInputContentItem}>Người tham gia</Text>
            {/** danh sách người tham hiển thị */}
            <DropdownCustom
              data={listParticipant}
              value={""}
              handleOnChange={(item) => {
                if (listSelectedParticipantRender.length <= capacity - 1) {
                  const { empId, name } = item;
                  if (
                    !listSelectedParticipantRender.find(
                      (parItem) => parItem.empId == empId
                    )
                  ) {
                    setListSelectedParticipantRender((prev) => [
                      ...prev,
                      { empId, name },
                    ]);
                  } else {
                    Alert.alert(
                      "Thông báo",
                      "Người tham gia này đã tồn tại trong danh sách!"
                    );
                    return;
                  }
                } else {
                  Alert.alert(
                    "Thông báo",
                    "Số lượng người tham gia phải nhỏ hơn hoặc bằng sức chứa của phòng"
                  );
                  return;
                }
              }}
              labelOfValue={"name"}
              valueField={"empId"}
              nameIcon="supervised-user-circle"
              placeholder={"Chọn người tham gia"}
            />
          </View>

          <View style={style.contentItem}>
            <Text style={style.labelInputContentItem}>
              Danh sách người tham gia được chọn
            </Text>
            <View
              style={[
                style.contentItem,
                {
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <View style={{ width: "68%" }}>
                {/** danh sách người tham gia được chọn */}
                <DropdownCustom
                  data={listSelectedParticipantRender}
                  value={""}
                  handleOnChange={() => {}}
                  labelOfValue={"name"}
                  valueField={"empId"}
                  nameIcon="supervised-user-circle"
                  isVisibleSearch={false}
                  placeholder={listSelectedParticipantRender
                    .map((item) => item.name)
                    .join(",")}
                />
              </View>

              {listSelectedParticipantRender.length > 0 && (
                <TouchableOpacity
                  style={{
                    width: "28%",
                    height: "40",
                    backgroundColor: "#003b95",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => setIsOpenModalSelectedParticipant(true)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Tùy chỉnh
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            style.contentItem,
            {
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={{
              width: 150,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00c4dc",
              borderRadius: 8,
            }}
            onPress={handleRequestReservationRoom}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Gửi phê duyệt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/** Modal Calendar choose day start */}
      <ModalCalendar
        isOpenModal={isOpenModalDayStart}
        handleOnModal={handleDayOnModalDayStart}
      />
      {/** Modal Calendar choose day end */}
      <ModalCalendar
        isOpenModal={isOpenModalDayEnd}
        handleOnModal={handleDayOnModalDayEnd}
      />
      {/** Modal Choose Day Remove */}
      <ModalTime
        timeFinishFrequency={timeFinishFrequency}
        isOpenModal={isOpenModalRemoveDay}
        handleCloseModal={() => {
          setIsOpenModalRemoveDay(false);
          setDaySelectedRemove((prev) => []);
        }}
        handleRemoveDay={handleRemoveItemTime}
        handleAcceptedRemoveDay={handleAcceptedRemoveItem}
        type={"DAY"}
      />
      {/** Modal Choose Week Of Day Remove */}
      <ModalTime
        timeFinishFrequency={listWeekOfDayRender}
        isOpenModal={isOpenModalRemoveWeekOfDay}
        handleCloseModal={() => {
          setIsOpenModalRemoveWeekOfDay(false);
          setWeekOfDaySelectedRemove((prev) => []);
        }}
        handleRemoveDay={handleRemoveItemTime}
        handleAcceptedRemoveDay={handleAcceptedRemoveItem}
        type={"WEEKOFDAY"}
      />

      {/** Modal Choose Day Of Week Remove */}
      <ModalTime
        timeFinishFrequency={timeFinishFrequency}
        isOpenModal={isOpenModalRemoveDayOfWeek}
        handleCloseModal={() => {
          setIsOpenModalRemoveDayOfWeek(false);
          setDayOfWeekSelectRemove((prev) => []);
        }}
        handleRemoveDay={handleRemoveItemTime}
        handleAcceptedRemoveDay={handleAcceptedRemoveItem}
        type={"DAYOFWEEK"}
      />
      {/** Modal loading and notification */}
      {isOpenModalNotification && (
        <Modal transparent={true}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {loading == true ? (
              <View
                style={{
                  width: "80%",
                  height: 150,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  alignSelf: "center",
                  borderRadius: 10,
                  top: "35%",
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}
                >
                  Đang xử lý yêu cầu...
                </Text>
                <ActivityIndicator size={40} />
              </View>
            ) : (
              <Popup
                isOpen={isOpenModalNotification}
                title={"Thông báo"}
                status={message.status}
                content={message.body}
                titleButtonAccept={"OK"}
                size={message.reason == "duplicated" ? "large" : "default"}
                handleOnPopup={() => {
                  setIsOpenModalNotification(false);
                  if (message.status == "success") navigation.navigate("Tabs");
                }}
                handleViewDetailError={() => {
                  setIsOpenModalDetailDuplicatedSchedule(true);
                }}
              />
            )}
          </View>
        </Modal>
      )}
      {/** Modal tùy chỉnh dịch vụ */}
      <ModalServe
        isOpenModal={isOpenModalDrink}
        dataModal={listSelectedServiceRender}
        handleCloseModal={() => {
          setIsOpenModalDrink(false);
          setDrinkSelectedRemove([]);
        }}
        handleRemoveItem={handleRemoveDrink}
        handleAcceptedRemoveItem={handleAcceptedRemoveItem}
        title={"Xóa dịch vụ"}
        type={"DRINK"}
      />
      {/** Modal tùy chỉnh dịch vụ */}
      <ModalServe
        isOpenModal={isOpenModalSelectedParticipant}
        dataModal={listSelectedParticipantRender}
        handleCloseModal={() => {
          setIsOpenModalSelectedParticipant(false);
          setParticipantSelectedRemove([]);
        }}
        handleRemoveItem={handleRemoveParticipant}
        handleAcceptedRemoveItem={handleAcceptedRemoveItem}
        title={"Xóa người tham gia"}
        type={"PARTICIPANT"}
      />
      {/** Modal xem chi tiết trùng lịch */}
      <Modal
        transparent={true}
        visible={isOpenModalDetailDuplicatedSchedule}
        animationType="fade"
      >
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              top: "30%",
              height: 300,
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 15,
            }}
          >
            <Pressable
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-end",
              }}
              onPress={() => setIsOpenModalDetailDuplicatedSchedule(false)}
            >
              <MaterialIcons name="close" size={20} />
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  width: "40%",
                  textAlign: "center",
                }}
              >
                Ngày
              </Text>
              <Text>|</Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  width: "60%",
                  textAlign: "center",
                }}
              >
                Thời gian
              </Text>
            </View>
            <FlatList
              data={listDuplicatedSchedule}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "300",
                      width: "40%",
                      textAlign: "center",
                    }}
                  >
                    {item.dateDuplicated}
                  </Text>
                  <Text>|</Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "300",
                      width: "60%",
                      textAlign: "center",
                    }}
                  >
                    Từ {item.timeStart} đến {item.timeEnd}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => Math.random(7)}
            />
          </View>
        </View>
      </Modal>
    </DefaultLayout>
  );
}
