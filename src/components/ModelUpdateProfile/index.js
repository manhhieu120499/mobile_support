import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { axiosConfig } from "../../utilities";

export default function ModelUpdateProfile({closeModal, data, handleUpdateProfile}) {

    const [userName, setUserName] = useState(data.employeeName);
    const [email, setEmail] = useState(data.email);
    const [avt, setAvt] = useState(null);
    const [avtBase64, setAvtBase64] = useState(null);

    const handleChooseImageFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });
        
    
        if (!result.canceled) {
          console.log(result.assets[0].uri);
          setAvt(result.assets[0].uri);
          setAvtBase64(result.assets[0].base64)
        }
    };

    const handleUploadToCloudinary = async (base64Image) => {
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${base64Image}`);
        formData.append("upload_preset", "picture");
      
        try {
          const response = await fetch("https://api.cloudinary.com/v1_1/drfbxuss6/image/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          return data.secure_url;
        } catch (error) {
          console.error("Upload failed:", error);
        }
    };
      

    const handleSubmit = async () => {
        let avtUpload;
        
        if(avt) {
            avtUpload = await handleUploadToCloudinary(avtBase64);
        } else {avtUpload = ""};
        try{
            const responseUpdate = await axiosConfig().put(
                "/api/v1/employee/upDateEmployee",
                {
                    employeeId: data.employeeId,
                    phone: data.phone,
                    email: email,
                    employeeName: userName,
                    departmentId: data.department.departmentId,
                    role: data.account.role,
                    avatar: avtUpload
                }
            )
            data.employeeName = responseUpdate.data.employeeName;
            data.email = responseUpdate.data.email;
            data.avatar = responseUpdate.data.avatar;
            handleUpdateProfile(data);
            closeModal();
        } catch(e) {
            console.log(e);
            
        }
        
    }

    return (
        <View style={{width: '100%', padding: 10}}>
            <Text style={{fontSize: 18, fontWeight: "bold",
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0, 0, 0, 0.2)",
                borderStyle: "solid"
            }}>Cập nhật thông tin</Text>
            <View>
                <View style={{alignItems: "center"}}>
                    <TouchableOpacity onPress={handleChooseImageFromLibrary}>
                        <Image style={{
                            width: 100,
                            height: 100,
                            marginTop: 25,
                            borderRadius: 999,
                            borderStyle: "solid",
                            borderColor: "rgba(0,0,0,0.2)",
                            borderWidth: 1
                        }} source={{uri: avt || data.avatar}} />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 15}}>Ảnh đại diện</Text>
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>Họ và tên</Text>
                <TextInput value={userName} onChangeText={e => setUserName(e)} style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }} />
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>Email</Text>
                <TextInput value={email} onChangeText={e => setEmail(e)} style={{
                    borderStyle: "solid",
                    borderColor: "rgba(0, 0, 0, 0.2)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10, 
                    marginTop: 5
                }}/>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 20}}>
                <TouchableOpacity style={{width: 100, padding: 10, backgroundColor: "#3C72DB",
                borderRadius: 10, marginRight: 10
                }}
                    onPress={handleSubmit}
                ><Text style={{textAlign: "center"}}>Lưu</Text></TouchableOpacity>
                <TouchableOpacity style={{width: 100, padding: 10, backgroundColor: "red",
                borderRadius: 10
                }}
                    onPress={closeModal}
                ><Text style={{textAlign: "center"}}>Hủy</Text></TouchableOpacity>
            </View>
        </View>
    )
}