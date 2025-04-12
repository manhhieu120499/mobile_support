import { Text, View } from "react-native";
import CardScheduleItem from "../CardScheduleItem";
const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

export default function ScheduleUserItem({data, handleTransferScreenScheduleDetail}) {
    const formatTime = (time) => {
        const timeSplit = time.split("/");
        const timeConvert = new Date(timeSplit[2], timeSplit[1] - 1, timeSplit[0]);
        const date = timeConvert.getDate() < 10 ? `0${timeConvert.getDate()}` : timeConvert.getDate();
        const month = timeConvert.getMonth() + 1 < 10 ? `0${timeConvert.getMonth() + 1}` : timeConvert.getMonth() + 1;
        return `${days[timeConvert.getDay()]}, ${date}/${month}/${timeConvert.getFullYear()}`
    }

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
                    <Text style={{color: "white", fontWeight: 600}}>{formatTime(data.time)}</Text>
                </View>
            </View>
            {data.data.map((item, index) => <CardScheduleItem handleTransferScreenScheduleDetail={handleTransferScreenScheduleDetail} data={item} key={index} />)}
        </View>
    )
}