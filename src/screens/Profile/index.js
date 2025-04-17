import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { TextInput } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native";
import ModalCenter from "../../components/ModalCenter";
import ModelUpdateProfile from "../../components/ModelUpdateProfile";
import ModalChangePasswordProfile from "../../components/ModelChangePasswordProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  fileGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  }
});

export default function Profile({ navigation, route }) {
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [user, setUser] = useState({});
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("current_user");
      if (jsonValue != null) {
        const user = JSON.parse(jsonValue);
        setUser(user);
      }
    } catch (error) {
      console.error("Error reading user:", error);
    }
  };

  useEffect(
    () => {
      getUser();
    }, [])

  return (
    <DefaultLayout>
      <Header />
      <View style={[style.container, {
        padding: 15
      }]}>
        <Text style={{fontSize: 18, fontWeight: "bold",
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0, 0, 0, 0.2)",
          borderStyle: "solid"
        }}>Thông tin tài khoản</Text>
        <View>
          <View style={{alignItems: "center"}}>
            <Image style={{
              width: 150,
              height: 150,
              marginTop: 25,
              borderRadius: 999,
              borderStyle: "solid",
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 1
            }} source={{uri: user.avatar}} />
            <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 15}}>{user.employeeName}</Text>
          </View>
          <View style={{marginTop: 25}}>
            <Text style={{fontSize: 18, fontWeight: "bold", marginBottom: 15}}>Thông tin cá nhân</Text>
            <View style={style.fileGroup}>
              <Text style={{flex: 1}}>Email</Text>
              <Text style={{flex: 1}}>{user.email}</Text>
            </View>
            <View style={style.fileGroup}>
              <Text style={{flex: 1}}>Số điện thoại</Text>
              <Text style={{flex: 1}}>{user.phone}</Text>
            </View>
            <View style={style.fileGroup}>
              <Text style={{flex: 1}}>Phòng ban</Text>
              <Text style={{flex: 1}}>{user?.department?.depName}</Text>
            </View>
            <View style={style.fileGroup}>
              <Text style={{flex: 1}}>Chi nhánh</Text>
              <Text style={{flex: 1}}>{user?.department?.location?.building?.branch?.branchName}</Text>
            </View>
            <View style={[style.fileGroup]}>
              <Text style={{flex: 1}}>Mật khẩu</Text>
              <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                <TextInput style={{flex: 1}} secureTextEntry={true}>12345</TextInput>
                <TouchableOpacity onPress={() => {setModalPassword(true)}} style={{padding: 5}}>
                  <FontAwesomeIcon style={{marginRight: 10}} icon={faPen} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 10}}>
              <TouchableOpacity style={{padding: 10, backgroundColor: "#3C72DB",
                borderRadius: 10, marginRight: 10
              }}><Text style={{textAlign: "center"}}>Lịch sử đặt phòng</Text></TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: "yellow",
                borderRadius: 10, marginRight: 10, width: 100
              }}
                onPress={() => {setModalUpdate(true)}}
              ><Text style={{textAlign: "center"}}>Cập nhật</Text></TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: "red",
                borderRadius: 10, width: 100
              }}><Text style={{textAlign: "center"}}>Đăng xuất</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ModalCenter isOpenModal={modalUpdate} closeModal={() => {setModalUpdate(false)}}>
        <ModelUpdateProfile data={user} closeModal={() => {setModalUpdate(false)}} />
      </ModalCenter>
      <ModalCenter isOpenModal={modalPassword} closeModal={() => {setModalPassword(false)}}>
        <ModalChangePasswordProfile data={user} closeModal={() => {setModalPassword(false)}} />
      </ModalCenter>
    </DefaultLayout>
  );
}
