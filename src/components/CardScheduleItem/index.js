import { Text, TouchableOpacity, View } from "react-native";

export default function CardScheduleItem() {
    return (
        <TouchableOpacity style={{
            margin: 10,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#ffe031",
            borderLeftWidth: 10,
            backgroundColor:"#fff8ce"
        }}>
            <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 5}}>
                Phương hướng doanh nghiệp
            </Text>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
                <View style={{
                    borderRadius: 999,
                    width: 7,
                    height: 7,
                    backgroundColor: "red",
                    marginRight: 5,
                }}></View>
                <Text>8:30 - 9:30</Text>
            </View>
            <Text style={{marginBottom: 5}}>Phòng phát triển</Text>
            <Text>Vị trí: Tầng 2 - tòa D - chi nhánh TP. Hồ Chí Minh</Text>
        </TouchableOpacity>
    )
}