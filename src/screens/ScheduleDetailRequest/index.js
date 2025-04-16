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
  formatUTC7,
} from "../../utilities";

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
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 70, height: 70 },
  contentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  groupInfo: { width: "70%", height: "100%" },
  title: {
    fontSize: 15,
    width: 80,
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

export default function ScheduleDetailRequest({ navigation, route }) {
  const infoScheduleRequest = route?.params?.infoScheduleRequest;
  const [schedule, setSchedule] = useState("");
  const [listService, setListService] = useState([]);
  const [listParticipant, setListParticipant] = useState([]);
  const [isOpenModalService, setIsOpenModalService] = useState(false);
  const [isOpenModalAttendant, setIsOpenModalAttendant] = useState(false);
  const [isOpenModalDocument, setIsOpenModalDocument] = useState(false);

  useEffect(() => {
    setListService(
      infoScheduleRequest.services.map((item) => {
        return {
          serviceName: item.serviceName,
          servicePrice: item.priceService.value,
        };
      })
    );
    setListParticipant(
      infoScheduleRequest.attendants.map((item) => {
        return {
          attendantName: item.employeeName,
          attendantPhone: item.phone,
        };
      })
    );
  }, []);

  return (
    <DefaultLayout>
      <Header
        nameScreen="scheduledetailrequest"
        leftIcon={"chevron-left"}
        handleOnPressLeftIcon={() => navigation.goBack("")}
      ></Header>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
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
                  {infoScheduleRequest
                    ? infoScheduleRequest.booker.employeeName
                    : ""}
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
                  {infoScheduleRequest ? infoScheduleRequest.reservationId : ""}
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
                  {infoScheduleRequest ? infoScheduleRequest.room.roomName : ""}
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
                  {infoScheduleRequest
                    ? formatPrice(infoScheduleRequest.room.priceValue)
                    : ""}
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
                  {infoScheduleRequest
                    ? infoScheduleRequest.time
                        .toString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.containerImage}>
              <Text
                style={[styles.title, { textAlign: "center", marginBottom: 7 }]}
              >
                Trạng thái
              </Text>
              <Text
                style={[
                  styles.info,
                  { color: "red", textDecorationLine: "underline" },
                ]}
              >
                {infoScheduleRequest
                  ? infoScheduleRequest.statusReservation
                  : ""}
              </Text>
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
              <Text style={styles.info}>
                {infoScheduleRequest ? infoScheduleRequest.title : ""}
              </Text>
            </View>
            <View style={[styles.informationItem, { gap: 0, height: 55 }]}>
              <View style={{ width: "50%" }}>
                <Text style={styles.title}>Thời gian: </Text>
                <Text style={styles.info}>
                  {infoScheduleRequest
                    ? formatUTC7(infoScheduleRequest.timeStart)
                    : ""}{" "}
                  -{" "}
                  {infoScheduleRequest
                    ? formatUTC7(infoScheduleRequest.timeEnd)
                    : ""}
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={styles.title}>Ngày họp: </Text>
                <Text style={styles.info}>
                  {infoScheduleRequest
                    ? infoScheduleRequest.timeStart
                        .toString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.informationItem}>
              <View style={{ width: "60%", flexDirection: "row" }}>
                <Text style={styles.title}>Loại phòng: </Text>
                <Text style={styles.info}>
                  {infoScheduleRequest ? infoScheduleRequest.room.typeRoom : ""}
                </Text>
              </View>
              <View style={{ width: "40%", flexDirection: "row" }}>
                <Text style={styles.title}>Sức chứa: </Text>
                <Text style={styles.info}>
                  {infoScheduleRequest ? infoScheduleRequest.room.capacity : ""}
                </Text>
              </View>
            </View>
            <View style={styles.informationItem}>
              <Text style={styles.title}>Ghi chú: </Text>
              <Text style={styles.info}>
                {infoScheduleRequest ? infoScheduleRequest.note : ""}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={styles.title}>Mô tả: </Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.info}>
                {infoScheduleRequest ? infoScheduleRequest.description : ""}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={[styles.title, { width: 160 }]}>
                Thời gian nhận phòng:{" "}
              </Text>
              <Text style={styles.info}>
                {infoScheduleRequest.timeCheckIn != null
                  ? formatUTC7(infoScheduleRequest.timeCheckIn)
                  : "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={[styles.title, { width: 160 }]}>
                Thời gian trả phòng:{" "}
              </Text>
              <Text style={styles.info}>
                {infoScheduleRequest.timeCheckOut != null
                  ? formatUTC7(infoScheduleRequest.timeCheckOut)
                  : "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.informationItem}>
              <Text style={[styles.title, { width: 160 }]}>
                Thời gian huỷ:{" "}
              </Text>
              <Text style={styles.info}>
                {infoScheduleRequest.timeCancel != null
                  ? formatUTC7(infoScheduleRequest.timeCancel)
                  : "Chưa cập nhật"}
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
              Danh sách tài liệu
            </Text>
            {infoScheduleRequest.documents == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Không có tài liệu</Text>
              </View>
            )}
            <FlatList
              style={{ marginTop: 45, paddingHorizontal: 25 }}
              data={infoScheduleRequest.filePaths}
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
              keyExtractor={(item, index) => index.toString()}
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
            {listService.length == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Không có dịch vụ</Text>
              </View>
            )}
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
              keyExtractor={(item, index) => index.toString()}
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
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </DefaultLayout>
  );
}
