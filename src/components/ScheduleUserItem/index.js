import { Text, View } from "react-native";
import CardScheduleItem from "../CardScheduleItem";

export default function ScheduleUserItem({data}) {
    return (
        <View style={{
            marginTop: 10,
        }}>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
                <View style={{
                    height: 2,
                    width: 10,
                    backgroundColor: "#003b95"
                }}></View>
                <View style={{
                    backgroundColor: "#003b95",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10
                }}>
                    <Text style={{color: "white", fontWeight: 600}}>Th 3, 01/04</Text>
                </View>
            </View>
            <CardScheduleItem />
        </View>
    )
}