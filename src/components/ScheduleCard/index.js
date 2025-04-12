import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import CheckBox from "expo-checkbox";
import { axiosConfig, formatUTC7 } from "../../utilities";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    flexDirection: "row",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: "bold" },
  buttonSmall: {
    width: 95,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});

const APPROVED = "APPROVED";
const UPDATE = "UPDATE";
const PENDING = "PENDING";

const formatRequest = {
  [APPROVED]: "Phê duyệt",
  [UPDATE]: "Cập nhật",
  [PENDING]: "Đặt lịch",
};

export default function ScheduleCard({
  scheduleInfo,
  isChecked,
  setMessage,
  setLoading,
  setOpenModalNotification,
  handleApprovedOrRejectSuccess,
  navigation,
}) {
  const [inputReject, setInputReject] = useState("");
  const [isOpenModalReject, setIsOpenModalReject] = useState(false);
  const handleApproveReservation = async () => {
    setOpenModalNotification(true);
    try {
      setLoading(true);
      const res = await axiosConfig().post(
        `/api/v1/requestForm/approveRequestForm`,
        [scheduleInfo.requestFormId]
      );
      if (res.data) {
        setMessage({
          body: "Phê duyệt thành công",
          status: "success",
        });
        handleApprovedOrRejectSuccess(scheduleInfo.requestFormId);
      }
    } catch (err) {
      setMessage({
        body: `Phê duyệt không thành công.\n ${err.response.data}`,
        status: "error",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleRejectReservation = async () => {
    setOpenModalNotification(true);
    try {
      setLoading(true);
      const res = await axiosConfig().post(
        `api/v1/requestForm/rejectRequestForm?reasonReject=${inputReject}`,
        [scheduleInfo.requestFormId]
      );
      if (res.data.length > 0) {
        // xét message
        setMessage({
          body: "Từ chối yêu cầu đặt lịch thành công",
          status: "success",
        });
        handleApprovedOrRejectSuccess(scheduleInfo.requestFormId);
        setInputReject("");
        setIsOpenModalReject(false);
      }
    } catch (err) {
      setMessage({
        body: `Từ chối yêu cầu đặt lịch không thành công.\n ${err.response.data}`,
        status: "error",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <View style={{ width: "100%" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          {scheduleInfo.requestReservation.title}
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          {isChecked && (
            <View style={{ width: "10%" }}>
              <CheckBox value={isChecked} />
            </View>
          )}
          <View style={{ width: !isChecked ? "100%" : "90%" }}>
            <Text style={style.text}>
              <Text style={style.bold}>Người đặt:</Text>{" "}
              {scheduleInfo?.reservations[0]?.booker?.employeeName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[style.text, { width: "55%" }]}>
                <Text style={style.bold}>Loại yêu cầu:</Text>{" "}
                {formatRequest[scheduleInfo?.statusRequestForm]}
              </Text>
            </View>
            <Text style={style.text}>
              <Text style={style.bold}>Thời gian gửi:</Text>{" "}
              {scheduleInfo?.timeRequest
                .split("T")[0]
                .split("-")
                .map((item) => item)
                .reverse()
                .join("-")}{" "}
              - {formatUTC7(scheduleInfo?.timeRequest)}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: isChecked ? "#ccc" : "#36cb33",
              },
            ]}
            disabled={isChecked}
            onPress={handleApproveReservation}
          >
            <Text style={style.textButton}>Phê duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: isChecked ? "#ccc" : "#dc3640",
              },
            ]}
            disabled={isChecked}
            onPress={() => setIsOpenModalReject(true)}
          >
            <Text style={style.textButton}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              style.buttonSmall,
              {
                backgroundColor: "#003b95",
              },
            ]}
            onPress={() =>
              navigation.navigate("ScheduleDetailRequest", {
                infoScheduleRequest: {
                  booker: scheduleInfo.reservations[0].booker,
                  reservationId: scheduleInfo.requestFormId,
                  statusReservation: scheduleInfo.statusRequestForm,
                  timeRequest: scheduleInfo.timeRequest,
                  room: scheduleInfo.reservations[0].room,
                  documents: scheduleInfo.reservations[0].filePaths,
                  services: scheduleInfo.reservations[0].services,
                  attendants: scheduleInfo.reservations[0].attendants,
                  requestInfo: scheduleInfo.reservations[0],
                },
              })
            }
          >
            <Text style={style.textButton}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={isOpenModalReject}
        animationType="fade"
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={() => setIsOpenModalReject(false)}
        >
          <View
            style={{
              width: "90%",
              top: "30%",
              height: 160,
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                textAlign: "center",
                marginVertical: 5,
              }}
            >
              Vui lòng điền lý do từ chối
            </Text>
            <TextInput
              placeholder="Điền lý do..."
              placeholderTextColor={"#ccc"}
              style={{
                width: "90%",
                height: 50,
                borderRadius: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                alignSelf: "center",
                fontSize: 15,
                marginTop: 8,
              }}
              value={inputReject}
              multiline={true}
              onChangeText={(text) => setInputReject(text)}
            />
            <View
              style={{
                width: 100,
                borderRadius: 20,
                alignSelf: "flex-end",
                marginRight: 10,
                paddingTop: 15,
              }}
            >
              <Button title="Xác nhận" onPress={handleRejectReservation} />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
