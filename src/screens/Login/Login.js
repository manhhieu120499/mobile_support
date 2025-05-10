import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Pressable } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { axiosConfig } from "../../utilities";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setNotification, updateNumber } from "../../slice/NotificationSlice";
import { setupSocket } from "../../utilities/socketSetup";
import { setStompClient } from "../../utilities/socketInstance";

const LoginScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return false;
    }
    const regexUsername = /^(09|07|03|08|05)\d{8}$/;
    if (!regexUsername.test(username)) {
      Alert.alert(
        "Thông báo",
        "Số điện thoại không hợp lệ\n. Số điện thoại có độ dài tối đa 10 chữ số và bắt đầu bằng (09,07,03,05,08)"
      );
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const res = await axiosConfig().post("/api/v1/account/login", {
          userName: username,
          password: password,
        });
        
        if (res.status == 200) {
          const dataUser = jwtDecode(res.data);
          
          if (dataUser.role != "ADMIN") {
            await AsyncStorage.setItem("token", res.data);
            const response = await axiosConfig().get(
              "/api/v1/employee/getEmployeeByPhone?phone=" + dataUser.userName
            );
            const user = JSON.stringify(response.data);
            
            await AsyncStorage.setItem("userCurrent", user);
            
            const resGetNotification = await axiosConfig().get(
              `/api/v1/notification/getAllNotification?employeeId=${response.data.employeeId}`
            );

            const unreadCount = resGetNotification.data.filter(item => !item.read).length;
            dispatch(setNotification(resGetNotification.data));
            dispatch(updateNumber(unreadCount));
            
            const client = setupSocket(response.data.employeeId, dispatch);
            setStompClient(client);
            
            navigation.navigate("Tabs");
          } else {
            Alert.alert(
              "Thông báo",
              "Bạn không thể đăng nhập vào tài khoản này"
            );
            return;
          }
        }
      } catch (err) {
        Alert.alert("Thông báo", `Đăng nhập không thành công\n${err}`);
        console.log(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/drfbxuss6/image/upload/v1744446582/Booking_w1cmz7.png",
        }} // Đổi thành ảnh bạn có
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục.</Text>

      <View style={styles.inputBox}>
        <TextInput
          placeholder="Nhập số điện thoại"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          numberOfLines={1}
        />
      </View>

      <View
        style={[
          styles.inputBox,
          {
            position: "relative",
          },
        ]}
      >
        <TextInput
          placeholder="Nhập mật khẩu"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          numberOfLines={1}
        />

        {!showPassword && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ position: "absolute", top: 15, right: 20 }}
          >
            <FontAwesome6Icon name="eye-slash" size={20} color="black" />
          </Pressable>
        )}
        {showPassword && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ position: "absolute", top: 15, right: 20 }}
          >
            <FontAwesome6Icon name="eye" size={20} color="black" />
          </Pressable>
        )}
      </View>

      <View style={styles.rememberMeRow}>
        <Text style={styles.rememberText}>Ghi nhớ mật khẩu</Text>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor={rememberMe ? "#0d1c34" : "#ccc"}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  illustration: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    marginTop: 4,
  },
  inputBox: {
    backgroundColor: "#f1f2f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    position: "relative",
  },
  input: {
    fontSize: 16,
    width: "80%",
  },
  rememberMeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rememberText: {
    fontSize: 14,
    color: "#444",
  },
  button: {
    backgroundColor: "#0d1c34",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    color: "#aaa",
  },
  signupLink: {
    color: "#0d1c34",
    fontWeight: "bold",
  },
});

export default LoginScreen;
