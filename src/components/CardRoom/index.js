import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { formatPrice } from "../../utilities";

const style = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e2e7",
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  content: {
    width: "70%",
    paddingHorizontal: 8,
  },
  contentItem: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default function CardRoom({ roomInfo }) {
  const {
    roomName = "",
    capacity,
    imgs = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQzlPF5Hp80DPQr9tP4-fpbhRxmGNRwb4ezKhQx8hm-1RNtGFSuk9PjcR2BwoT8ITG4PhRgajKZEXyRX4vgvfhGxsZBrJweWWpAwbGblEU",
    priceValue,
  } = roomInfo;
  const { floor = "" } = roomInfo.location;
  const { buildingName = "", branch } = roomInfo.location.building;
  return (
    <View style={style.container}>
      <View
        style={{
          width: "30%",
        }}
      >
        <View style={{ width: "100%", height: 80, borderRadius: 8 }}>
          <Image
            source={{
              uri: `${imgs[0]}`,
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </View>
      </View>

      <View style={style.content}>
        <View style={style.contentItem}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {roomName}
          </Text>
        </View>

        {/** branch */}
        <View style={[style.contentItem, { gap: 10 }]}>
          <FontAwesome6Icon name="map-pin" size={20} color={"#6d717c"} />
          <Text style={{ fontSize: 14, color: "#6d717c" }}>
            {branch.branchName}
          </Text>
        </View>

        {/** floor */}
        <View style={[style.contentItem, { justifyContent: "space-between" }]}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View>
              <FontAwesome6Icon name="building" size={15} color={"#6d717c"} />
            </View>
            <Text style={{ fontSize: 14, color: "#6d717c" }}>
              Tòa {buildingName} - tầng {floor}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <FontAwesome6Icon name="user-group" size={14} color={"#6d717c"} />
            <Text style={{ fontSize: 16, color: "#6d717c" }}>
              {capacity} người
            </Text>
          </View>
        </View>

        {/** đặt ngay */}
        <View
          style={{
            marginBottom: 8,
            marginTop: 6,
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/** price */}
          <View style={{ width: "55%" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {formatPrice(priceValue)}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: "45%",
              height: 35,
              backgroundColor: "#2296f3",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Đặt ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
