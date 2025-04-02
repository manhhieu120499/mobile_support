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
import { axiosConfig, formatPrice } from "../../utilities";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2F1", padding: 10 },
  card: { borderRadius: 10, padding: 10, backgroundColor: "white" },
  image: { width: "100%", height: 200, borderRadius: 10 },
  infoContainer: { padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 16, marginBottom: 2 },
  bold: { fontWeight: "bold" },
  button: { backgroundColor: "#007AFF" },
  equipmentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 300,
  },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  equipmentText: { fontSize: 16 },
  equipmentQuantity: { fontSize: 16, fontWeight: "bold" },
});

export default function RoomDetail({ navigation, route }) {
  const { room: roomItem } = route?.params;
  const [listDevice, setListDevice] = useState([]);

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
                <Text style={styles.bold}>Loại phòng:</Text> {roomItem.typeRoom}
              </Text>
            </View>
            <Text style={styles.text}>
              <Text style={styles.bold}>Người phê duyệt:</Text>{" "}
              {roomItem.approver.employeeName}
            </Text>
            <Text style={[styles.text, { marginVertical: 4 }]}>
              <Text style={styles.bold}>Số điện thoại:</Text>{" "}
              {roomItem.approver.phone}
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
                {roomItem.statusRoom}
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
                },
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
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </DefaultLayout>
  );
}
