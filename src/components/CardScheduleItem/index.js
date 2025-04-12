import { Text, TouchableOpacity, View } from "react-native";

export default function CardScheduleItem({data, handleTransferScreenScheduleDetail}) {
    const getTime = (time) => {
        const date = new Date(time);
        const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        return `${date.getHours()}:${minute}`
    }
    return (
        <TouchableOpacity style={{
            margin: 10,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: data.statusReservation === "PENDING" ? "#ffe031" : "#2196f3",
            borderLeftWidth: 10,
            backgroundColor: data.statusReservation === "PENDING" ? "#fff8ce" : "#e3f2fd",
        }}
            onPress={() => {
                handleTransferScreenScheduleDetail({infoScheduleRequest: 
                    data
                })
            }}
        >
            <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 5}}>
                {data.title}
            </Text>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5,
                justifyContent: "space-between"
            }}>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
                    <View style={{
                        borderRadius: 999,
                        width: 7,
                        height: 7,
                        backgroundColor: "red",
                        marginRight: 5,
                    }}></View>
                    <Text>{`${getTime(data.timeStart)}-${getTime(data.timeEnd)}`}</Text>
                </View>
                <Text style={{marginBottom: 5, fontWeight: "bold"}}>{`Phòng ${data.room.roomName}`}</Text>
            </View>
        </TouchableOpacity>
    )
}