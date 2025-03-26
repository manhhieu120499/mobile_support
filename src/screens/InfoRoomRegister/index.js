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
} from "../../utilities";
import {
  CalendarCustom,
  DropdownCustom,
  ModalCalendar,
  ModalServe,
  ModalTime,
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

export default function InfoRoomRegister({ navigation, route }) {
  const { infoRoom } = route.params;
  const [booker, setBooker] = useState({});
  const [listServices, setListService] = useState([]);
  const [titleMeeting, setTitleMeeting] = useState("");
  const [timeStart, setTimeStart] = useState("07:00");
  const [timeEnd, setTimeEnd] = useState("07:30");
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
  const [isEditTimeEnd, setIsEditTimeEnd] = useState(true);
  const [timeEndFilterByTimeStart, setTimeEndFilterByTimeStart] = useState(() =>
    renderTime()
  );
  const [dayStart, setDayStart] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dayEnd, setDayEnd] = useState(new Date().toISOString().split("T")[0]);
  const [timeFinishFrequency, setTimeFinishFrequency] = useState([]);

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

  // state remove day or weekOfDay
  const [daySelectedRemove, setDaySelectedRemove] = useState([]);
  const [weekOfDaySelectRemove, setWeekOfDaySelectedRemove] = useState([]);

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
    typePopup: "small",
  });

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
        AsyncStorage.getItem("current_user"),
      ]);
      const user = JSON.parse(userJson);
      const formatData = res.data
        .map((emp) => ({
          empId: emp.employeeId,
          name: emp.employeeName,
          phone: emp.phone,
        }))
        .filter((emp) => emp.empId != user.employeeId);

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

  // xử lý cập nhật giờ kết thúc theo giờ bắt đầu
  const handleUpdateTimeEndByTimeStart = (time) => {
    const timesOriginal = renderTime();
    const indexTimeStart = timesOriginal.findIndex((t) => t.time == time);
    return timesOriginal.slice(indexTimeStart + 1, timesOriginal.length);
  };

  // xử lý render lại giờ kết thúc
  useEffect(() => {
    setTimeEndFilterByTimeStart((prev) => [
      ...handleUpdateTimeEndByTimeStart(timeStart),
    ]);
  }, [timeStart]);

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
        const resImages = [1];
        for (const file of listDocument) {
          const { data, status, message } = await uploadImageToCloudinary(
            file.file
          );
          if (status == "success") resImages.push(data);
          else {
            setMessage({
              body: "Thông báo \nGửi yêu cầu thất bại. Vui lòng kiểm tra lại kết nối mạng",
              status: "err",
              typePopup: "small",
            });
            console.log(message);
          }
        }

        if (resImages.length > 0) {
          // gửi request đặt phòng
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
              note: note,
              description: description,
              title: titleMeeting,
              frequency: formatFrequency(frequency),
              bookerId: booker.employeeId,
              roomId: infoRoom.roomId,
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
          if (res.status == 200) {
            setMessage({
              body: "Gửi phê duyệt thành công",
              status: "success",
              typePopup: "small",
            });
          }
        }
      } catch (err) {
        setLoading(false);
        if (err.status == 400) {
          const arrMessage = err.response.data
            .map((item) => {
              const infoDuplicate = {
                title: item.title,
                start: item.timeStart.toString().split("T")[0],
                end: item.timeEnd.toString().split("T")[0],
              };
              return `${infoDuplicate.title}- thời gian: ${infoDuplicate.start} ${infoDuplicate.end}`;
            })
            .slice(0, 3)
            .join("\n");
          setMessage({
            body: `Trùng lịch.\n${arrMessage}`,
            status: "err",
            typePopup: "big",
          });
        } else {
          setMessage({
            body: "Gửi phê duyệt thất bại.\nVui lòng kiểm tra lại thông tin hoặc đường truyền mạng",
            status: "err",
            typePopup: "small",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // xử lý remove day
  const handleRemoveDay = (item, flag) => {
    if (flag) setDaySelectedRemove((prev) => [...prev, item]);
    else
      setDaySelectedRemove((prev) => prev.filter((dayItem) => dayItem == item));
  };

  // xử lý remove week of day
  const handleRemoveWeekOfDay = (item, flag) => {
    if (flag) setWeekOfDaySelectedRemove((prev) => [...prev, item]);
    else
      setWeekOfDaySelectedRemove((prev) =>
        prev.filter((weekOfDayItem) => weekOfDayItem == item)
      );
  };

  // xử lý modal chọn ngày bắt đầu
  const handleDayOnModalDayStart = (selectedDate) => {
    setDayStart(selectedDate);
    setIsOpenModalDayStart(false);
  };

  // xử lý modal chọn ngày kết thúc
  const handleDayOnModalDayEnd = (selectedDate) => {
    setDayEnd(selectedDate);
    setIsOpenModalDayEnd(false);
    setTimeFinishFrequency([
      ...getAllDayBetweenDayStartAndDayEnd(dayStart, selectedDate),
    ]);
  };

  // xử lý xác nhận remove ngày bị loại bỏ
  const handleAcceptedRemoveDay = () => {
    setTimeFinishFrequency((prev) =>
      prev.filter((item) => !daySelectedRemove.includes(item))
    );
    setDaySelectedRemove([]);
    setIsOpenModalRemoveDay(false);
    setIsActiveRemoveWeekOfDay(true);
  };

  // xử lý xác nhận remove ngày bị loại bỏ
  const handleAcceptedRemoveWeekOfDay = () => {
    setTimeFinishFrequency((prev) =>
      prev.filter((item) => !weekOfDaySelectRemove.includes(item))
    );
    setWeekOfDaySelectedRemove([]);
    setIsOpenModalRemoveWeekOfDay(false);
    setIsActiveRemoveDay(true);
  };

  // xử lý xác nhận remove ngày bị loại bỏ
  const handleAcceptedRemoveDrink = () => {
    setListSelectedServiceRender((prev) =>
      prev.filter((item) => !drinkSelectedRemove.includes(item))
    );
    setDrinkSelectedRemove([]);
    setIsOpenModalDrink(false);
  };

  // xử lý xác nhận remove ngày bị loại bỏ
  const handleAcceptedRemoveParticipant = () => {
    setListSelectedParticipantRender((prev) =>
      prev.filter((item) => !participantSelectRemove.includes(item))
    );
    setParticipantSelectedRemove([]);
    setIsOpenModalSelectedParticipant(false);
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
        handleOnPressLeftIcon={() => navigation.goBack("")}
      />
      <ScrollView
        style={style.container}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      >
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Chọn phòng</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Chọn phòng"
              value={infoRoom.roomName}
              style={style.inputContent}
              editable={false}
            />
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
        <View style={style.contentItem}>
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
            />
            <TouchableOpacity
              style={{
                width: "15%",
                alignItems: "flex-end",
                justifyContent: "center",
                height: "100%",
              }}
              onPress={() => setIsOpenModalDayStart(true)}
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
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Giờ bắt đầu</Text>

          <DropdownCustom
            data={renderTime()}
            value={timeStart}
            handleOnChange={(item) => {
              setTimeStart(item.time);
              setIsEditTimeEnd(false);
            }}
            labelOfValue={"time"}
            valueField={"time"}
            nameIcon="punch-clock"
          />
        </View>
        <View style={style.contentItem}>
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
            isDisable={isEditTimeEnd}
          />
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
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tần suất</Text>

          <DropdownCustom
            data={frequencyData}
            value={frequency}
            handleOnChange={(item) => setFrequency(item.frequency)}
            labelOfValue={"frequency"}
            nameIcon="punch-clock"
          />
        </View>
        <View style={style.contentItem}>
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
              editable={frequency == "MỘT LẦN" ? false : true}
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
        {frequency != "MỘT LẦN" && dayEnd && (
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
              onPress={() => setIsOpenModalRemoveWeekOfDay(true)}
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
                setListSelectedServiceRender((prev) => [...prev, { id, name }]);
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
                const { empId, name } = item;
                setListSelectedParticipantRender((prev) => [
                  ...prev,
                  { empId, name },
                ]);
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
        handleRemoveDay={handleRemoveDay}
        handleAcceptedRemoveDay={handleAcceptedRemoveDay}
        type={"DAY"}
      />
      {/** Modal Choose Week Of Day Remove */}
      <ModalTime
        timeFinishFrequency={timeFinishFrequency}
        isOpenModal={isOpenModalRemoveWeekOfDay}
        handleCloseModal={() => {
          setIsOpenModalRemoveWeekOfDay(false);
          setWeekOfDaySelectedRemove((prev) => []);
        }}
        handleRemoveDay={handleRemoveWeekOfDay}
        handleAcceptedRemoveDay={handleAcceptedRemoveWeekOfDay}
        type={"WEEKOFDAY"}
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
              <View
                style={{
                  width: "85%",
                  minHeight: message.typePopup == "small" ? 200 : 300,
                  maxHeight: 500,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  alignSelf: "center",
                  borderRadius: 10,
                  top: "35%",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Thông báo
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "normal",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {message.body}
                </Text>
                <Pressable
                  style={{
                    width: 55,
                    height: 35,
                    alignSelf: "flex-end",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "#00c4dc",
                    borderRadius: 10,
                    marginRight: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setIsOpenModalNotification(false);
                    if (message.status == "success")
                      navigation.navigate("CreateSchedule");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    OK
                  </Text>
                </Pressable>
              </View>
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
        handleAcceptedRemoveItem={handleAcceptedRemoveDrink}
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
        handleAcceptedRemoveItem={handleAcceptedRemoveParticipant}
      />
    </DefaultLayout>
  );
}
