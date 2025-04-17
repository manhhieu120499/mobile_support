import { TouchableOpacity } from "react-native";
import { Image, Text, TextInput, View } from "react-native";

export default function ModalChangePasswordProfile({closeModal}) {
    return (
        <View style={{width: '100%', padding: 10}}>
            <Text style={{fontSize: 18, fontWeight: "bold",
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0, 0, 0, 0.2)",
                borderStyle: "solid"
            }}>Cập nhật mật khẩu</Text>
            <View>
                <View style={{alignItems: "center"}}>
                    <Image
                        source={{
                            uri: "https://res.cloudinary.com/drfbxuss6/image/upload/v1744446582/Booking_w1cmz7.png",
                        }} // Đổi thành ảnh bạn có
                        style={{
                            width: "80%",
                            height: 200,
                        }}
                        resizeMode="contain"
                    />
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>Mật khẩu cũ</Text>
                <TextInput placeholder="Nhập mật khẩu cũ" style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }}></TextInput>
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>Mật khẩu mới</Text>
                <TextInput placeholder="Nhập mật khẩu mới" style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }}></TextInput>
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>Xác nhận mật khẩu mới</Text>
                <TextInput placeholder="Nhập lại mật khẩu mới" style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }}></TextInput>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 20}}>
                <TouchableOpacity style={{width: 100, padding: 10, backgroundColor: "#3C72DB",
                borderRadius: 10, marginRight: 10
                }}><Text style={{textAlign: "center"}}>Lưu</Text></TouchableOpacity>
                <TouchableOpacity style={{width: 100, padding: 10, backgroundColor: "red",
                borderRadius: 10
                }}
                    onPress={closeModal}
                ><Text style={{textAlign: "center"}}>Hủy</Text></TouchableOpacity>
            </View>
        </View>
    )
}