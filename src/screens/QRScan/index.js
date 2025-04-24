import { CameraView } from "expo-camera";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosConfig } from "../../utilities";
import { Alert } from "react-native";
import { Popup } from "../../components";

export default function QRScan({ navigation }) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const bounceValue = useRef(new Animated.Value(1)).current;
  const [dataQR, setDataQR] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState({
    error: false,
    success: false,
  });
  const [message, setMessage] = useState({
    body: "Trùng lịch\nNgày: 20-02-2020\nThời gian: 08:00 - 10:00",
    status: "error",
    reason: "duplicated",
  });
  const [info, setInfo] = useState({
    reservationId: "",
    employeeId: "",
  });
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [listScheduleDuplicated, setListScheduleDuplicated] = useState([]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Animated for scan area
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleCheckInRoom = async (dataQRCode) => {
    const userJson = await AsyncStorage.getItem("userCurrent");
    console.log(1);
    const user = JSON.parse(userJson);
    const request = {
      encryptedData: dataQRCode,
      employeeId: user.employeeId,
    };
    try {
      const resp = await axiosConfig().post(
        "/api/v1/reservation/checkIn",
        request
      );
      console.log(resp);
      if (resp.status == 200) {
        setMessage({
          body: "Check in thành công",
          status: "success",
          reason: "",
        });
        setInfo({
          reservationId: resp.data.decryptedData.split("=")[1],
          employeeId: user.employeeId,
        });
      } else {
        setMessage({
          body: "Giải mã qr không thành công\nVui lòng thử lại",
          status: "error",
          reason: "duplicated",
        });
        setIsOpenPopup((prev) => ({ ...prev, err: true }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (dataQR != "") handleCheckInRoom(dataQR);

  const handleErrorDuplicatedSchedule = () => {
    setIsOpenModalDetail(true);
  };

  return (
    <>
      <SafeAreaView
        style={[StyleSheet.absoluteFillObject, { position: "relative" }]}
      >
        {Platform.OS === "android" ? <StatusBar hidden /> : null}
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          // flash="on"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              console.log("Retrieved data: ", data);
              setDataQR(data);
              setTimeout(async () => {
                await Linking.openURL(data);
              }, 300);
            }
          }}
        />

        <View style={styles.scanAreaIndicator}>
          <Animated.View
            style={[
              styles.cornerTopLeft,
              { transform: [{ scale: bounceValue }] },
            ]}
          />
          <Animated.View
            style={[
              styles.cornerTopRight,
              { transform: [{ scale: bounceValue }] },
            ]}
          />
          <Animated.View
            style={[
              styles.cornerBottomLeft,
              { transform: [{ scale: bounceValue }] },
            ]}
          />
          <Animated.View
            style={[
              styles.cornerBottomRight,
              { transform: [{ scale: bounceValue }] },
            ]}
          />
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 10 }}
          >
            <MaterialCommunityIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton}>
            <MaterialCommunityIcons
              name="account-box-outline"
              size={25}
              color="#fff"
            />
            <Text style={styles.qrButtonText}>Mã QR của tôi</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionText}>Quét mọi mã QR</Text>
          <View style={styles.optionIcons}>
            <Text style={[styles.optionItem, { fontWeight: "500" }]}>
              VIETQR
            </Text>
            <Text style={styles.optionItem}>🌐 website</Text>
            <Text style={[styles.optionItem, { fontWeight: "500" }]}>Zalo</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerButton}>
            <Entypo name="image" size={24} color="#fff" />
            <Text style={styles.footerText}>Ảnh có sẵn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Entypo name="back-in-time" size={24} color="#fff" />
            <Text style={styles.footerText}>Gần đây</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* Popup*/}
      <Popup
        isOpen={isOpenPopup.error}
        title={"Thông báo"}
        content={message.body}
        status={message.status}
        handleOnPopup={(type) => {
          if (type == "Thoát" || type == "Hủy") {
            setIsOpenPopup((prev) => ({ ...prev, error: false }));
          }
        }}
        titleButtonReject={message.reason == "duplicated" ? "Thoát" : "Thử lại"}
        size={message.reason == "duplicated" ? "large" : "default"}
        handleViewDetailError={
          message.reason == "duplicated"
            ? handleErrorDuplicatedSchedule
            : undefined
        }
      />
      <Popup
        isOpen={isOpenPopup.success}
        title={"Thông báo"}
        content={message.body}
        status={message.status}
        handleOnPopup={(type) => {
          setIsOpenPopup((prev) => ({ ...prev, success: false }));
          navigation.navigate("ScheduleDetailRoom", {
            reservationId: info.reservationId,
            employeeId: info.employeeId,
          });
        }}
        titleButtonAccept={"OK"}
      />

      {/** Modal xem chi tiết trùng lịch */}
      <Modal
        transparent={true}
        visible={isOpenModalDetail}
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
              onPress={() => setIsOpenModalDetail(false)}
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
              data={
                listScheduleDuplicated.length > 0 ? listScheduleDuplicated : [1]
              }
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
                    20-02-2020
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
                    Từ 08:00 đến 10:00
                  </Text>
                </View>
              )}
              keyExtractor={(item) => Math.random}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scanAreaIndicator: {
    position: "absolute",
    top: (Dimensions.get("window").height - 250) / 2,
    left: (Dimensions.get("window").width - 250) / 2,
    width: 250,
    height: 250,
    zIndex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
    zIndex: 1,
  },
  qrButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    zIndex: 1,
  },
  qrButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    zIndex: 1,
  },
  optionsContainer: {
    position: "absolute",
    top: 180,
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
    zIndex: 1,
  },
  optionText: {
    color: "#fff",
    fontSize: 15,
  },
  optionIcons: {
    flexDirection: "row",
    marginTop: 5,
    width: "60%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  optionItem: {
    color: "#fff",
    fontSize: 17,
    marginHorizontal: 5,
  },
  footerContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: 50,
    zIndex: 1,
  },
  footerButton: {
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderColor: "#fff",
    borderTopLeftRadius: 10,
    zIndex: 1,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderColor: "#fff",
    borderTopRightRadius: 10,
    zIndex: 1,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderColor: "#fff",
    borderBottomLeftRadius: 10,
    zIndex: 1,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: "#fff",
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
});
