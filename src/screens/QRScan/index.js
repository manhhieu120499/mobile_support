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
} from "react-native";
import { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosConfig } from "../../utilities";
import { Alert } from "react-native";

export default function QRScan({ navigation }) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const bounceValue = useRef(new Animated.Value(1)).current;
  const [dataQR, setDataQR] = useState("");

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
    console.log("Vòa");
    const userJson = await AsyncStorage.getItem("current_user");
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
        Alert.alert("Thông báo", resp.data.message);
      } else {
        Alert.alert("Thông báo", "Giải mã qr không thành công");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (dataQR != "") handleCheckInRoom(dataQR);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
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
          <Text style={[styles.optionItem, { fontWeight: "500" }]}>VIETQR</Text>
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
  );
}

const styles = StyleSheet.create({
  scanAreaIndicator: {
    position: "absolute",
    top: (Dimensions.get("window").height - 250) / 2,
    left: (Dimensions.get("window").width - 250) / 2,
    width: 250,
    height: 250,
  },
  headerContainer: {
    position: "absolute",
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  qrButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  qrButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  optionsContainer: {
    position: "absolute",
    top: 180,
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
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
  },
});
