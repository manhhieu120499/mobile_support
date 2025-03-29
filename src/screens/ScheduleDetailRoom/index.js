import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import {
  axiosConfig,
  formatPrice,
  transferTimeToMinutes,
} from "../../utilities";
import { Popup } from "../../components";

const styles = StyleSheet.create({
  container: { width: "100%", padding: 10, backgroundColor: "white" },
  cardHeader: {
    padding: 10,
    height: 140,
  },
  cardContent: {
    padding: 10,
  },
  containerImage: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 70, height: 70 },
  contentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  groupInfo: { width: "80%", height: "100%" },
  title: {
    fontSize: 15,
    width: 85,
  },
  info: { fontSize: 15, fontWeight: "500" },
  informationItem: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor: "white",
    height: 40,
    gap: 20,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  titleTimeHeader: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

const formatUTC7 = (time) => {
  const temp = new Date(time)
    .toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
    .split(",")[0];
  const [hour, minutes, second] = temp.split(":").map(Number);
  return `${hour}:${minutes > 10 ? minutes : "00"}`;
};

export default function ScheduleDetailRoom({ navigation, route }) {
  const { reservationId: reservationData, employeeId } = route.params;
  const [reservationId, setReservationId] = useState(reservationData ?? "1");
  const [schedule, setSchedule] = useState("");
  const [listService, setListService] = useState([]);
  const [listParticipant, setListParticipant] = useState([]);
  const [isOpenModalService, setIsOpenModalService] = useState(false);
  const [isOpenModalAttendant, setIsOpenModalAttendant] = useState(false);
  const [isOpenModalDocument, setIsOpenModalDocument] = useState(false);
  const [clock, setClock] = useState({
    second: 20,
    minutes: 1,
    hour: 0,
  });
  const [isOpenPopup, setIsOpenPopup] = useState({
    warning: false,
    success: false,
  });

  const imageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s";

  const fetchSchedule = async () => {
    try {
      const res = await axiosConfig().get(
        `/api/v1/reservation/getReservationById?reservationId=${Number(
          reservationId
        )}`
      );
      const listServiceData = res.data.services.map((itemService) => ({
        serviceId: itemService.serviceId,
        serviceName: itemService.serviceName,
        servicePrice: itemService.priceService.value,
      }));
      const listParticipant = res.data.attendants.map((itemAttendant) => ({
        attendantId: itemAttendant.employeeId,
        attendantName: itemAttendant.employeeName,
        attendantPhone: itemAttendant.phone,
      }));
      setSchedule(res.data);
      setListService(listServiceData);
      setListParticipant(listParticipant);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // tạo đồng hồ đếm ngược
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setClock((prev) => {
        if (prev.hour === 0 && prev.minutes === 0 && prev.second === 0) {
          clearInterval(timeInterval);
          return prev;
        }

        let hour = prev.hour;
        let minutes = prev.minutes;
        let second = prev.second - 1;

        if (second < 0) {
          second = 59;
          minutes -= 1;
        }

        if (minutes < 0) {
          minutes = 59;
          hour -= 1;
        }

        return { hour, minutes, second };
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // thông báo khi hết giờ
  useEffect(() => {
    if (clock.hour == 0 && clock.minutes == 0 && clock.second == 0) {
      setIsOpenPopup((prev) => ({ ...prev, success: true }));
    }
  }, [clock]);

  // xử lý khi rời phòng sớm
  const handleLeavingRoom = () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().split("T")[0];
    const timeEnd = formatUTC7(schedule.timeEnd); // 10:00
    const timeEndFormat = new Date(`${currentDate}T${timeEnd}:00`)
      .toISOString()
      .split("T")[1];
    // const result =
    //   transferTimeToMinutes(currentTime.toISOString().split("T")[1]) -
    //   transferTimeToMinutes(timeEndFormat);
    const result = -1;
    if (result < 0) {
      setIsOpenPopup((prev) => ({ ...prev, warning: true }));
    }
  };

  return (
    <DefaultLayout>
      <Header nameScreen="scheduledeatilroom"></Header>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View
          style={{ width: "100%", alignItems: "flex-end", marginBottom: 10 }}
        >
          <Text style={styles.titleTimeHeader}>
            Thời gian còn lại: {clock.hour < 10 ? `0${clock.hour}` : clock.hour}
            :{clock.minutes < 10 ? `0${clock.minutes}` : clock.minutes}:
            {clock.second < 10 ? `0${clock.second}` : clock.second}
          </Text>
        </View>
        <Card style={styles.cardHeader}>
          <View style={styles.contentCard}>
            <View style={styles.groupInfo}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>Người đặt: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.booker.employeeName : ""}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>Id lịch: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.reservationId : ""}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>Tên phòng: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.room.roomName : ""}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>Giá phòng: </Text>
                <Text style={styles.info}>
                  {schedule ? formatPrice(schedule.room.priceValue) : ""}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>Ngày đặt: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.time.toString().split("T")[0] : ""}
                </Text>
              </View>
            </View>
            <View style={styles.containerImage}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
          </View>
        </Card>

        {/** Thông tin chi tiết */}
        <View
          style={{
            height: 15,
            width: "100%",
            backgroundColor: "white",
            marginVertical: 2,
          }}
        />
        <Card style={styles.cardContent}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            Thông tin chi tiết
          </Text>
          <View style={{ width: "100%" }}>
            <View style={styles.informationItem}>
              <Text style={styles.title}>Tiêu đề: </Text>
              <Text style={styles.info}>{schedule ? schedule.title : ""}</Text>
            </View>
            <View style={[styles.informationItem, { gap: 0, height: 55 }]}>
              <View style={{ width: "50%" }}>
                <Text style={styles.title}>Thời gian: </Text>
                <Text style={styles.info}>
                  {schedule ? formatUTC7(schedule.timeStart) : ""} -{" "}
                  {schedule ? formatUTC7(schedule.timeEnd) : ""}
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={styles.title}>Ngày họp: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.timeStart.toString().split("T")[0] : ""}
                </Text>
              </View>
            </View>
            <View style={styles.informationItem}>
              <View style={{ width: "60%", flexDirection: "row" }}>
                <Text style={styles.title}>Loại phòng: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.room.typeRoom : ""}
                </Text>
              </View>
              <View style={{ width: "40%", flexDirection: "row" }}>
                <Text style={styles.title}>Sức chứa: </Text>
                <Text style={styles.info}>
                  {schedule ? schedule.room.capacity : ""}
                </Text>
              </View>
            </View>
            <View style={styles.informationItem}>
              <Text style={styles.title}>Ghi chú: </Text>
              <Text style={styles.info}>{schedule ? schedule.note : ""}</Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={styles.title}>Mô tả: </Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.info}>
                {schedule ? schedule.description : ""}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={[styles.title, { width: 200 }]}>
                Thời gian nhận phòng:{" "}
              </Text>
              <Text style={styles.info}>
                {schedule ? formatUTC7(schedule.timeCheckIn) : ""}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={[styles.title, { width: 200 }]}>
                Thời gian trả phòng:{" "}
              </Text>
              <Text style={styles.info}>
                {schedule ? formatUTC7(schedule.timeCheckOut) : ""}
              </Text>
            </View>
            <View
              style={[
                styles.informationItem,
                {
                  height: 60,
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={styles.title}>Tài liệu: </Text>
              <Button
                style={{
                  backgroundColor: "#003b95",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setIsOpenModalDocument(true)}
              >
                <Text style={{ fontSize: 15, lineHeight: 18, color: "white" }}>
                  Xem chi tiết
                </Text>
              </Button>
            </View>
            <View
              style={[
                styles.informationItem,
                {
                  height: 60,
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={styles.title}>Dịch vụ: </Text>
              <Button
                style={{
                  backgroundColor: "#003b95",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setIsOpenModalService(true)}
              >
                <Text style={{ fontSize: 15, lineHeight: 18, color: "white" }}>
                  Xem chi tiết
                </Text>
              </Button>
            </View>
            <View
              style={[
                styles.informationItem,
                {
                  height: 60,
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={[styles.title, { width: 120 }]}>
                Người tham gia:{" "}
              </Text>
              <Button
                style={{
                  backgroundColor: "#003b95",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                }}
                onPress={() => setIsOpenModalAttendant(true)}
              >
                <Text style={{ fontSize: 15, lineHeight: 18, color: "white" }}>
                  Xem chi tiết
                </Text>
              </Button>
            </View>
          </View>
        </Card>

        {/** Button checkout */}
        <Button
          style={{
            width: 150,
            height: 40,
            borderRadius: 10,
            backgroundColor: "cyan",
            marginTop: 20,
            alignSelf: "center",
          }}
          onPress={() => handleLeavingRoom()}
        >
          <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
            Rời phòng
          </Text>
        </Button>
      </ScrollView>
      <Modal
        transparent={true}
        visible={isOpenModalDocument}
        animationType="slide"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "white",
              top: "30%",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Pressable
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 5,
                right: 5,
              }}
              onPress={() => setIsOpenModalDocument(false)}
            >
              <MaterialIcons name="close" size={20} color={"black"} />
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 15 }}>
              Danh sách dịch vụ
            </Text>
            <FlatList
              style={{ marginTop: 45, paddingHorizontal: 25 }}
              data={schedule.filePaths}
              renderItem={({ item }, index) => (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    backgroundColor: "#e7e7e7",
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: 40,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 17, height: "100%", lineHeight: 35 }}
                  >
                    {item}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.serviceId}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
      {/** Modal dịch vụ */}

      <Modal
        transparent={true}
        visible={isOpenModalService}
        animationType="slide"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "white",
              top: "30%",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Pressable
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 5,
                right: 5,
              }}
              onPress={() => setIsOpenModalService(false)}
            >
              <MaterialIcons name="close" size={20} color={"black"} />
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 14 }}>
              Danh sách dịch vụ
            </Text>
            <FlatList
              style={{ marginTop: 10, paddingHorizontal: 25 }}
              data={listService}
              renderItem={({ item }) => (
                <View
                  key={item.serviceId}
                  style={{
                    width: "100%",
                    backgroundColor: "#e7e7e7",
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: 40,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 17, height: "100%", lineHeight: 35 }}
                  >
                    {item.serviceName}
                  </Text>
                  <Text
                    style={{ fontSize: 17, height: "100%", lineHeight: 35 }}
                  >
                    {item.servicePrice}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.serviceId}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/** Modal người tham gia */}

      <Modal
        transparent={true}
        visible={isOpenModalAttendant}
        animationType="slide"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "white",
              top: "30%",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Pressable
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 5,
                right: 5,
              }}
              onPress={() => setIsOpenModalAttendant(false)}
            >
              <MaterialIcons name="close" size={20} color={"black"} />
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 14 }}>
              Danh sách người tham gia
            </Text>
            <FlatList
              style={{ marginTop: 10, paddingHorizontal: 25 }}
              data={listParticipant}
              renderItem={({ item }) => (
                <View
                  key={item.attendantId}
                  style={{
                    width: "100%",
                    backgroundColor: "#e7e7e7",
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: 40,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      height: "100%",
                      lineHeight: 35,
                      width: "60%",
                    }}
                  >
                    {item?.attendantName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      height: "100%",
                      lineHeight: 35,
                    }}
                  >
                    {item?.attendantPhone}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.attendantId}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Popup*/}
      <Popup
        isOpen={isOpenPopup.warning}
        title={"Thông báo"}
        content={"Bạn có chắc muốn rời phòng sớm không?"}
        status={"warning"}
        handleOnPopup={(type) => {
          if (type == "Hủy") {
            setIsOpenPopup((prev) => ({ ...prev, warning: false }));
          } else if (type == "OK") {
            setIsOpenPopup((prev) => ({ ...prev, warning: false }));
            navigation.navigate("CreateSchedule");
          }
        }}
        titleButtonReject={"Hủy"}
        titleButtonAccept={"OK"}
      />
      <Popup
        isOpen={isOpenPopup.success}
        title={"Thông báo"}
        content={"Thời gian họp đã kết thúc\nVui lòng xác nhận rời phòng."}
        status={"success"}
        handleOnPopup={(type) => {
          setIsOpenPopup((prev) => ({ ...prev, success: false }));
          navigation.navigate("CreateSchedule");
        }}
        titleButtonAccept={"Rời phòng"}
      />
    </DefaultLayout>
  );
}
