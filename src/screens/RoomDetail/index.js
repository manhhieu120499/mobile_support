import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import {
  axiosConfig,
  findTimeFitToRegisterRoom,
  formatPrice,
} from "../../utilities";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2F1", padding: 10 },
  card: { borderRadius: 10, padding: 10, backgroundColor: "white" },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoContainer: { padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 14.5, marginBottom: 2 },
  bold: { fontWeight: "bold" },
  button: { backgroundColor: "#007AFF" },
  equipmentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 210,
  },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 30,
  },
  equipmentText: { fontSize: 14.5 },
  equipmentQuantity: { fontSize: 14.5, fontWeight: "bold" },
});

export default function RoomDetail({ navigation, route }) {
  const { room: roomItem } = route?.params;
  const [listDevice, setListDevice] = useState([]);

  console.log(roomItem);

  useEffect(() => {
    (async function () {
      try {
        const res = await axiosConfig().get(
          `api/v1/room/getRoomById?roomId=${roomItem.roomId}`
        );
        setListDevice(res.data.room_deviceDTOS);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // fetch
  return (
    <DefaultLayout>
      <Header
        leftIcon={"chevron-left"}
        handleOnPressLeftIcon={() => navigation.goBack("")}
        nameScreen="roomdetail"
      />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Image source={{ uri: roomItem.imgs[0] }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{roomItem.roomName}</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Vị trí:</Text>{" "}
              {roomItem.location.building.branch.branchName} -{" tòa "}
              {roomItem.location.building.buildingName} - tầng{" "}
              {roomItem.location.floor}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 4,
              }}
            >
              <Text style={[styles.text, { width: "50%" }]}>
                <Text style={styles.bold}>Sức chứa:</Text> {roomItem.capacity}{" "}
                người
              </Text>
              <Text style={[styles.text, { width: "50%" }]}>
                <Text style={styles.bold}>Loại phòng:</Text>{" "}
                {roomItem.typeRoom == "DEFAULT"
                  ? "Mặc định"
                  : roomItem.typeRoom == "VIP"
                  ? "VIP"
                  : "Hội nghị"}
              </Text>
            </View>
            <Text style={styles.text}>
              <Text style={styles.bold}>Người phê duyệt:</Text>{" "}
              {roomItem.approver ? roomItem.approver.employeeName : "Chưa có"}
            </Text>
            <Text style={[styles.text, { marginVertical: 4 }]}>
              <Text style={styles.bold}>Số điện thoại:</Text>{" "}
              {roomItem.approver ? roomItem.approver.phone : "Chưa có"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 4,
              }}
            >
              <Text style={[styles.text, { width: "45%" }]}>
                <Text style={styles.bold}>Giá:</Text>{" "}
                {formatPrice(roomItem.priceValue)}
              </Text>
              <Text style={[styles.text, { width: "55%" }]}>
                <Text style={styles.bold}>Trạng thái:</Text>{" "}
                {roomItem.statusRoom == "AVAILABLE"
                  ? "Có sẵn"
                  : roomItem.statusRoom == "MAINTAIN"
                  ? "Bảo trì"
                  : roomItem.statusRoom == "REPAIR"
                  ? "Sửa chữa"
                  : "Đang sử dụng"}
              </Text>
            </View>
          </View>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              navigation.navigate("InfoRoomRegister", {
                infoRoom: {
                  roomId: roomItem.roomId,
                  roomName: roomItem.roomName,
                  capacity: roomItem.capacity,
                },
                statusCheckTime:
                  findTimeFitToRegisterRoom() == 0 ? true : false,
              });
            }}
          >
            Đặt phòng
          </Button>
        </Card>

        <View style={styles.equipmentContainer}>
          <Text style={styles.subTitle}>Danh Sách Thiết Bị</Text>
          {listDevice.length > 0 && (
            <FlatList
              data={listDevice}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.equipmentText}>{item.deviceName}</Text>
                  <Text style={styles.equipmentQuantity}>{item.quantity}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </DefaultLayout>
  );
}
