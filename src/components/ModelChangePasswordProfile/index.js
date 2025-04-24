import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Image, Text, TextInput, View } from "react-native";
import { axiosConfig } from "../../utilities";

export default function ModalChangePasswordProfile({closeModal, userName, token}) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        if(!oldPassword) {
            alert("Vui lòng nhập mật khẩu cũ");
            return;
        }
        if(!newPassword) {
            alert("Vui lòng nhập mật khẩu mới");
            return;
        }
        if(confirmPassword != newPassword) {
            alert("Xác nhận mật khẩu không chính xác");
            return;
        }
        
        try {
            console.log(userName)
            const response = await axiosConfig().post("/api/v1/account/changePassword", {
                userName,
                password: oldPassword,
                newPassword: newPassword
            });
            alert("Đổi mật khẩu thành công.")
            closeModal()
        } catch(e) {
            alert("Mật khẩu cũ không chính xác.")
            console.log(e.message)
        }
    }

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
                <TextInput value={oldPassword} onChangeText={e => setOldPassword(e)} placeholder="Nhập mật khẩu cũ" style={{
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
                <TextInput value={newPassword} onChangeText={e => setNewPassword(e)} placeholder="Nhập mật khẩu mới" style={{
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
                <TextInput value={confirmPassword} onChangeText={e => setConfirmPassword(e)} placeholder="Nhập lại mật khẩu mới" style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }}></TextInput>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 20}}>
                <TouchableOpacity
                    onPress={handleChangePassword}
                    style={{width: 100, padding: 10, backgroundColor: "#3C72DB",
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