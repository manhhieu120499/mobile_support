import { ScrollView } from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import { View } from "react-native";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosConfig } from "../../utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNumber } from "../../slice/NotificationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

export default function Notification({navigation}) {
    const notification = useSelector((state) => state.notification.list);
    const dispatch = useDispatch();
    const getEmployeeId = async () => {
        try {
        const jsonValue = await AsyncStorage.getItem("userCurrent");
        
        if (jsonValue != null) {
            const user = JSON.parse(jsonValue);
            return user.employeeId;
        }
        } catch (error) {
        console.error("Error reading user:", error);
        }
    };
    useEffect(() => {
        const updateRead = async () => {
            const employeeId = await getEmployeeId();
            
            axiosConfig()
                .post("/api/v1/notification/markAllAsRead", null, {
                    params: { employeeId },
                })
                .then((res) => {
                    dispatch(updateNumber(0));
                })
                .catch((err) => {
                    console.error("Lỗi khi đánh dấu đã đọc:", err);
                });
        }
        updateRead();

        notification.forEach(item => {
            console.log(item.message + " " + item.read);
            
        })
    }, [notification])

    const formatHourVietNam = (dateFormat) => {
        const date = new Date(dateFormat);
        const vietnamTime = date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
        return vietnamTime
    }

    return (
        <DefaultLayout>
            <Header
                nameScreen="scheduledetailrequest"
                leftIcon={"chevron-left"}
                handleOnPressLeftIcon={() => navigation.goBack("")}
            ></Header>
            <View style={{width: "100%"}}>
                <Text style={{
                    padding: 10,
                    fontSize: 20, fontWeight: 800,
                    color: "blue"
                }}>Thông báo</Text>
            </View>
            <ScrollView style={{
                flex: 1,
                width: "100%",
            }}>
                {notification.map((notification, index) => (
                    <View style={[{
                        padding: 10,
                        paddingVertical: 20,
                        borderStyle:"solid",
                        borderColor: "#58A0FF",
                        borderBottomWidth: 1,
                        backgroundColor: "#E7F3FF",
                        marginBottom: 10,
                        borderRadius: 10,
                        borderLeftWidth: 5,
                        marginLeft: 3
                        },
                        index == 0 && {
                            borderTopWidth: 1,
                        }
                    ]}
                        key={index}
                    >
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>
                            {notification.message}
                        </Text>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <FontAwesomeIcon color="#559BF7" size={13} style={{marginTop: 6}} icon={faCalendar} />
                            <Text style={{
                                marginTop: 7,
                                marginLeft: 7
                            }}>
                                {formatHourVietNam(notification.createdAt)}
                            </Text>
                        </View>
                    </View> 
                ))}
                
                {
                    notification.length == 0 && (
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Text style={{fontSize: 16}}>Không có thông báo nào.</Text>
                        </View>
                    )
                }
            </ScrollView>
        </DefaultLayout>
    )
}