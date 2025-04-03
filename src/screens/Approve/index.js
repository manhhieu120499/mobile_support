import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Button,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { ModalCalendar, ScheduleCard } from "../../components";
import CheckBox from "expo-checkbox";

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  containerFilterSearch: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    height: 38,
  },
  inputContainerFilterSearch: {
    height: "100%",
    paddingLeft: 12,
    width: "80%",
  },
  btnSearchInContainerFilterSearch: {
    width: "15%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#afb2b7",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  contentItem: {
    width: "100%",
    marginBottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  labelInputContentItem: {
    fontSize: 17,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  inputContent: {
    height: "100%",
    fontSize: 15,
  },
  inputInContentItem: {
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 5,
  },
  buttonSmall: {
    width: 90,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonMedium: {
    width: 120,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#0064e0",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});

export default function Approve({ navigation, route }) {
  const [isOpenModalDayStart, setIsOpenModalDayStart] = useState(false);
  const [isOpenModalDayEnd, setIsOpenModalDayEnd] = useState(false);
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [isCheckAll, setIsCheckAll] = useState(false);

  return (
    <DefaultLayout>
      <Header nameScreen="approve">
        <View style={style.containerFilterSearch}>
          <TextInput
            placeholder="Nhập tên cuộc họp hoặc tên người đặt..."
            style={style.inputContainerFilterSearch}
            onChangeText={(text) => setInputSearch(text)}
          />
          <Pressable style={style.btnSearchInContainerFilterSearch}>
            <MaterialIcons name="search" size={26} color={"white"} />
          </Pressable>
        </View>
      </Header>
      <View style={style.container}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View
            style={{
              width: "42%",
              marginVertical: 7,
            }}
          >
            <View style={style.contentItem}>
              <View
                style={[
                  style.inputInContentItem,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <TextInput
                  placeholder="Ngày bắt đầu"
                  value={dayStart}
                  style={style.inputContent}
                />
                <TouchableOpacity
                  style={{
                    width: "15%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: "100%",
                  }}
                  onPress={() => setIsOpenModalDayStart(true)}
                >
                  <FontAwesomeIcon
                    name="calendar"
                    size={20}
                    style={{ textAlign: "right" }}
                    color={"black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={style.contentItem}>
              <View
                style={[
                  style.inputInContentItem,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <TextInput
                  placeholder="Ngày kết thúc"
                  value={dayEnd}
                  style={style.inputContent}
                />
                <TouchableOpacity
                  style={{
                    width: "15%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: "100%",
                  }}
                  onPress={() => setIsOpenModalDayEnd(true)}
                >
                  <FontAwesomeIcon
                    name="calendar"
                    size={20}
                    style={{ textAlign: "right" }}
                    color={"black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "58%",
              marginVertical: 7,
              justifyContent: "center",
              gap: 15,
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity style={style.buttonMedium}>
              <Text style={style.textButton}>Tìm kiếm</Text>
            </TouchableOpacity>
            <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={[
                  style.buttonSmall,
                  {
                    backgroundColor: !isCheckAll ? "#ccc" : "#36cb33",
                  },
                ]}
                disabled={!isCheckAll}
              >
                <Text style={style.textButton}>Phê duyệt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  style.buttonSmall,
                  {
                    backgroundColor: !isCheckAll ? "#ccc" : "#dc3640",
                  },
                ]}
                disabled={!isCheckAll}
              >
                <Text style={style.textButton}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/** line straight */}
        <View
          style={{ width: "100%", backgroundColor: "#e7e7e7", height: 1 }}
        />
        <View style={{ width: "100%", marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CheckBox
              value={isCheckAll}
              onValueChange={() => setIsCheckAll((prev) => !prev)}
            />
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Chọn tất cả</Text>
          </View>
        </View>
      </View>
      <ScheduleCard isChecked={isCheckAll} />
      <ScheduleCard isChecked={isCheckAll} />
      {/** Modal choose day start */}
      <ModalCalendar
        isOpenModal={isOpenModalDayStart}
        handleOnModal={(dateSelected) => {
          setDayStart(dateSelected);
          setIsOpenModalDayStart(false);
        }}
      />
      {/** Modal choose day end */}
      <ModalCalendar
        isOpenModal={isOpenModalDayEnd}
        handleOnModal={(dateSelected) => {
          setDayEnd(dateSelected);
          setIsOpenModalDayEnd(false);
        }}
      />
    </DefaultLayout>
  );
}
