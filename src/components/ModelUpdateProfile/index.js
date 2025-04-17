import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ModelUpdateProfile({closeModal, data}) {

    const [userName, setUserName] = useState(data.employeeName);
    const [email, setEmail] = useState(data.email);
    const [avt, setAvt] = useState(data.avatar);

    // Yêu cầu quyền truy cập thư viện
    // useEffect(() => {
    //     (async () => {
    //       if (Platform.OS !== "web") {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== "granted") {
    //           alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
    //         } else {
    //           console.log("✅ Đã được cấp quyền truy cập ảnh");
    //         }
    //       }
    //     })();
    //   }, []);

    const handleChooseImageFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          console.log(result.assets[0].uri);
          setAvt((prev) => [...prev, { file: result.assets[0].uri }]);
        }
      };

    const handleSubmit = () => {
        console.log(userName);
        console.log(email);
        
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
                        }} source={{uri: data.avatar}} />
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