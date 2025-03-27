import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";

const roomData = {
  name: "Maria",
  location: "Hà Nội - tòa A - tầng 1",
  capacity: 15,
  type: "Mặc định",
  approver: "Nguyễn Trọng Đạt",
  price: "$100",
  status: "Có sẵn",
  phone: "0914653334",
  imageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s", // Thay thế bằng ảnh thực tế
  devices: [
    { name: "Máy chiếu loại 1", quantity: 1 },
    { name: "Bảng trắng", quantity: 1 },
    { name: "Ti vi", quantity: 2 },
    { name: "Công cụ loa", quantity: 1 },
    { name: "Laptop", quantity: 1 },
    { name: "Máy chiếu loại 2", quantity: 2 },
    { name: "Màn hình LED", quantity: 1 },
    { name: "Micro không dây", quantity: 1 },
  ],
};

const styles = StyleSheet.create({
  container: { width: "100%", padding: 10, backgroundColor: "#e0f2f1" },
  card: { padding: 10 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  content: { padding: 10, width: "100%", flexDirection: "column" },
  title: { fontSize: 20, fontWeight: "bold" },
  info: { fontSize: 14, marginVertical: 2, width: "50%" },
  location: { fontSize: 14, marginVertical: 2, width: "100%" },
  qrButton: { marginVertical: 10 },
  deviceTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  deviceText: { fontSize: 14 },
  deviceQuantity: { fontSize: 14, fontWeight: "bold" },
  addButton: { alignSelf: "center", marginTop: 10 },
  titleTimeHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    width: "100%",
  },
  containerHeaderTitleTime: {
    width: "100%",
    flexDirection: "row",
  },
  group: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export default function ScheduleDetailRoom({ navigation, route }) {
  return (
    <DefaultLayout>
      <Header nameScreen="scheduledeatilroom">
        <Text style={styles.titleTimeHeader}>Thời gian còn lại: 00:55:00</Text>
      </Header>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Image source={{ uri: roomData.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>Tên phòng - {roomData.name}</Text>
            <Text style={styles.location}>Vị trí: {roomData.location}</Text>
            <View style={styles.group}>
              <Text style={styles.info}>
                Sức chứa: {roomData.capacity} người
              </Text>
              <Text style={styles.info}>Loại phòng: {roomData.type}</Text>
            </View>

            <Text style={[styles.info, { width: "100%" }]}>
              Người phê duyệt: {roomData.approver}
            </Text>
            <Text style={styles.info}>Giá: {roomData.price}</Text>
            <Text style={styles.info}>Trạng thái: {roomData.status}</Text>
            <Text style={[styles.info, { width: "100%" }]}>
              Số điện thoại: {roomData.phone}
            </Text>
            <Text style={styles.deviceTitle}>Danh Sách Thiết Bị</Text>
            <FlatList
              data={roomData.devices}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceText}>{item.name}</Text>
                  <Text style={styles.deviceQuantity}>{item.quantity}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
            <TouchableOpacity style={styles.addButton}>
              <AntDesign name="pluscircle" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </DefaultLayout>
  );
}
