import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { renderTime } from "../../utilities";
import { DropdownCustom } from "../../components";

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  contentItem: {
    width: "100%",
    height: 80,
    marginBottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  inputInContentItem: {
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 5,
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
});

const frequencyData = [
  { frequency: "MỘT LẦN" },
  { frequency: "MỖI NGÀY" },
  { frequency: "MỖI TUẦN" },
];

export default function InfoRoomRegister({ navigation, route }) {
  const { infoRoom } = route;
  return (
    <DefaultLayout>
      <Header />
      <ScrollView style={style.container}>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Chọn phòng</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Chọn phòng"
              value="Phòng đa cấp"
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tiêu đề</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập tiêu đề"
              value="Chiến lược marketing"
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Ngày</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập ngày"
              value="20/03/2025"
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Giờ bắt đầu</Text>

          <DropdownCustom
            data={renderTime()}
            value={renderTime()[0]}
            handleOnChange={() => {}}
            labelOfValue={"time"}
            nameIcon="clock"
          />
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Giờ kết thúc</Text>

          <DropdownCustom
            data={renderTime()}
            value={renderTime()[1]}
            handleOnChange={() => {}}
            labelOfValue={"time"}
            nameIcon="clock"
          />
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Ghi chú</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập ghi chú"
              value=""
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Mô tả</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập mô tả"
              value=""
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tần suất</Text>

          <DropdownCustom
            data={frequencyData}
            value={frequencyData[0]}
            handleOnChange={() => {}}
            labelOfValue={"frequency"}
            nameIcon="clock"
          />
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Ngày kết thúc</Text>
          <View style={style.inputInContentItem}>
            <TextInput
              placeholder="Nhập ngày"
              value="20/03/2025"
              style={style.inputContent}
            />
          </View>
        </View>
        <View style={style.contentItem}>
          <Text style={style.labelInputContentItem}>Tài liệu</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "70%" }}>
              <DropdownCustom
                data={[]}
                value={""}
                handleOnChange={() => {}}
                labelOfValue={"file"}
                nameIcon="clock"
              />
            </View>
            <TouchableOpacity
              style={{
                width: 90,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#003b95",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Tải lên</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text>Dịch vụ</Text>
          <TextInput
            placeholder="Nhập mô tả cuộc họp"
            value="Chiến lược marketing"
          />
        </View>
        <View>
          <Text>Người tham gia</Text>
          <TextInput
            placeholder="Nhập mô tả cuộc họp"
            value="Chiến lược marketing"
          />
        </View>
        <View
          style={[
            style.contentItem,
            {
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={{
              width: 150,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00c4dc",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Gửi phê duyệt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
}
