import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Button,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  ModalCalendar,
  ScheduleCard,
  Popup,
  DropdownCustom,
} from "../../components";
import CheckBox from "expo-checkbox";
import { axiosConfig } from "../../utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDebounce } from "../../hooks";

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
  const [inputSearch, setInputSearch] = useState("");
  const debouncedValue = useDebounce(inputSearch, 200);

  const [listApproveSchedule, setListApproveSchedule] = useState([]);
  const [listApproveScheduleFilter, setListApproveScheduleFilter] = useState(
    []
  );

  const [isLoading, setIslLoading] = useState(false);
  const [message, setMessage] = useState({
    body: "",
    status: "",
  });
  const [isOpenModalNotification, setIsOpenModalNotification] = useState(false);

  const [filterSchedule, setFilterSchedule] = useState("Đang chờ");

  // fetch list approve schedule
  const fetchApproveScheduleData = async () => {
    try {
      const userJson = await AsyncStorage.getItem("current_user");
      const user = JSON.parse(userJson);
      const res = await axiosConfig().get(
        `/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}&statusRequestForm=PENDING`
      );
      setListApproveSchedule(res.data);
      setListApproveScheduleFilter(
        res?.data?.filter((item) => item.statusRequestForm == "PENDING")
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApproveScheduleData();
  }, []);

  useEffect(() => {
    let nameFilter = "";
    switch (filterSchedule) {
      case "Đang chờ": {
        nameFilter = "PENDING";
        break;
      }
      case "Đã phê duyệt": {
        nameFilter = "APPROVED";
        break;
      }
      case "Đã từ chối": {
        nameFilter = "REJECT";
        break;
      }
    }
    setListApproveScheduleFilter(
      listApproveSchedule.filter((item) => item.statusRequestForm == nameFilter)
    );
  }, [filterSchedule]);

  useEffect(() => {
    if (debouncedValue == "") {
      setListApproveScheduleFilter([...listApproveSchedule]);
    } else {
      const inputRegex = new RegExp(debouncedValue, "giu");
      console.log(inputRegex);
      setListApproveScheduleFilter((prev) =>
        listApproveSchedule.filter(
          (item) =>
            inputRegex.test(item.reservations[0].title) ||
            inputRegex.test(item.reservations[0].booker.employeeName)
        )
      );
    }
  }, [debouncedValue]);

  // handle when approve success
  const handleApprovedOrRejectSuccess = (scheduleBeApprovedId) => {
    setListApproveScheduleFilter((prev) =>
      prev.filter((item) => item.requestFormId != scheduleBeApprovedId)
    );
  };

  // handle approve all schedule
  const handleApproveAllSchedule = async () => {
    const arrIds = listApproveScheduleFilter.map((item) => item.requestFormId);
    setIsOpenModalNotification(true);
    try {
      setIslLoading(true);
      const res = await axiosConfig().post(
        `/api/v1/requestForm/approveRequestForm`,
        arrIds
      );
      if (res.data) {
        setMessage({
          body: "Phê duyệt thành công",
          status: "success",
        });
        setListApproveScheduleFilter((prev) => []);
      }
    } catch (err) {
      setMessage({
        body: `Phê duyệt không thành công.\n ${err.response.data}`,
        status: "error",
      });
      console.log(err);
    } finally {
      setIslLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Header nameScreen="approve">
        <View style={style.containerFilterSearch}>
          <TextInput
            placeholder="Nhập tên cuộc họp hoặc tên người đặt"
            style={style.inputContainerFilterSearch}
            onChangeText={(text) => setInputSearch(text)}
            value={inputSearch}
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
                onPress={handleApproveAllSchedule}
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
        <View style={{ width: "100%", marginTop: 10, flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "row",
              width: "50%",
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
          <View style={{ width: "50%" }}>
            <DropdownCustom
              data={[
                { name: "Đang chờ" },
                { name: "Đã phê duyệt" },
                { name: "Đã từ chối" },
              ]}
              value={filterSchedule}
              labelOfValue={"name"}
              valueField={"name"}
              handleOnChange={(item) => setFilterSchedule(item.name)}
              isVisibleSearch={false}
              nameIcon="filter-alt"
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 450,
          backgroundColor: "#f4f4f4",
          marginTop: 10,
        }}
      >
        <FlatList
          data={listApproveScheduleFilter}
          contentContainerStyle={{
            paddingBottom: 50,
          }}
          renderItem={({ item }) => {
            return (
              <ScheduleCard
                scheduleInfo={item}
                isChecked={isCheckAll}
                setLoading={setIslLoading}
                setMessage={setMessage}
                setOpenModalNotification={setIsOpenModalNotification}
                handleApprovedOrRejectSuccess={handleApprovedOrRejectSuccess}
                navigation={navigation}
              />
            );
          }}
          keyExtractor={(item) => item.requestFormId.toString()}
        />
      </View>

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

      {/** Modal loading and notification */}
      {isOpenModalNotification && (
        <Modal transparent={true}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {isLoading == true ? (
              <View
                style={{
                  width: "80%",
                  height: 150,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  alignSelf: "center",
                  borderRadius: 10,
                  top: "35%",
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}
                >
                  Đang xử lý yêu cầu...
                </Text>
                <ActivityIndicator size={40} />
              </View>
            ) : (
              <Popup
                isOpen={isOpenModalNotification}
                title={"Thông báo"}
                status={message.status}
                content={message.body}
                titleButtonAccept={"OK"}
                size={"medium"}
                handleOnPopup={() => {
                  setIsOpenModalNotification(false);
                }}
              />
            )}
          </View>
        </Modal>
      )}
    </DefaultLayout>
  );
}
