import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek"; 
import 'dayjs/locale/vi'; 
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
dayjs.locale('vi');

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export default function WeekSchedule({yearFilter, weekFilter, handleWeekFilterOnChange, closeModalWeekSchedule}) {
    const [weekOfYear, setWeekOfYear] = useState(null); 
    const getWeeksOfYear = (yearFilter) => {
        const weeks = [];
        let startOfWeek = dayjs(`${yearFilter}-01-01`).startOf("week");
        let weekNumber = 1;
        
        while (startOfWeek.year() === yearFilter || startOfWeek.month() === 11) {
            let endOfWeek = startOfWeek.endOf("week");
            
            if (endOfWeek.year() > yearFilter) {
                endOfWeek = dayjs(`${yearFilter}-12-31`);
            }

            weeks.push({
                weekNumber,
                startOfWeek,
                endOfWeek,
            });

            startOfWeek = startOfWeek.add(7, "day"); 
            weekNumber++;
        }
        return weeks;
    };
    useEffect(() => {
        setWeekOfYear(getWeeksOfYear(yearFilter));
    }, [])
    return (
        <View style={{flex: 1,height: "80%", paddingBottom: 15}}>
            <Text style={{fontSize: 17, textAlign: "center",
                paddingBottom: 12,
                paddingTop: 12,
                borderBottomColor: 'rgba(0,0,0, 0.2)',
                borderBottomWidth: 1,
                borderBottomStyle: "solid"
            }}>Chọn tuần</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {weekOfYear?.length != 0 &&
                    weekOfYear?.map((week, key) => (
                        <TouchableOpacity style={{
                            paddingHorizontal: 10,
                            paddingVertical: 7, 
                            borderBottomColor: 'rgba(0,0,0, 0.1)',
                            borderBottomWidth: 1,
                            borderBottomStyle: "solid",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                            key={key}
                            onPress={() => {
                                const days = dayjs(`${yearFilter}-01-01`).startOf("week").add(7 * (Number(week.weekNumber) - 1), "day");
                                handleWeekFilterOnChange(days.year(), days.month() + 1, days.date(), days)
                                closeModalWeekSchedule()
                            }}
                        >
                            <View>
                                <Text style={{fontSize: 15, fontWeight: 600, marginBottom: 5}}>{`Tuần ${week.weekNumber}`}</Text>
                                <Text style={{fontSize: 15}}>{`(${week.startOfWeek.format("DD/MM/YYYY")} -> ${week.endOfWeek.format("DD/MM/YYYY")})`}</Text>
                            </View>
                            {
                                weekFilter == week.weekNumber &&  
                                <FontAwesomeIcon size={20} icon={faCheck} color="green" />
                            }
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </View>
    )
}