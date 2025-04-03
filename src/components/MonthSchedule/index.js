import dayjs from "dayjs";
import "dayjs/locale/vi"; 
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons/faCaretLeft";
import weekday from 'dayjs/plugin/weekday';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { FlatList } from "react-native";
import 'dayjs/locale/vi'; 
import { useState } from "react";
dayjs.locale('vi');
dayjs.extend(weekday);
dayjs.extend(isLeapYear);
const weekDays = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

export default function MonthSchedule({dateFilter, dateCurrentFilter, 
    monthCurrentFilter, yearCurrentFilter,
    weekFilter, monthFilter, yearFilter, setDateFilter,
    setMonthFilter, setYearFilter, closeModalMonthSchedule}) {
    const [monthTemp, setMonthTemp] = useState(monthFilter);
    const [yearTemp, setYearTemp] = useState(yearFilter);
    const getDaysInMonth = (year, month) => {
        const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
        const firstDayOfMonth = dayjs(`${year}-${month}-01`).weekday() + 2;
        
        let days = [];
        let startOffset = (firstDayOfMonth + 6) % 7;
        
        for (let i = 1; i < startOffset; i++) {
            days.push({ day: null });
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i });
        }

        for (let i = days.length + 1; i <= 35; i++) {
            days.push({ day: null });
        }
        return days;
    };
    
    return (
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{fontSize: 21, fontWeight: 500}}>
                    {`Tháng ${monthTemp} ${yearTemp}`}
                </Text>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity
                        onPress={() => {
                            if(monthTemp == 1) {
                                setMonthTemp(12)
                                setYearTemp(yearTemp - 1)
                            } else {
                                setMonthTemp((state) => state - 1)
                            }
                        }}
                    >
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} size={30} icon={faCaretLeft} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            if(monthTemp == 12) {
                                setMonthTemp(1)
                                setYearTemp(yearTemp + 1)
                            } else {
                                setMonthTemp((state) => state + 1)
                            }
                        }}>
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} size={30} icon={faCaretRight} />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                    {weekDays.map((day, index) => (
                    <Text key={index} style={[{ width: 40, textAlign: 'center', fontWeight: 'bold' },
                        day === "Th 7" || day === "CN" ? {color: "red"} : {}
                    ]}>
                        {day}
                    </Text>
                    ))}
                </View>
                <FlatList
                    data={getDaysInMonth(yearTemp, monthTemp)}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    numColumns={7}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={[{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center'},
                        (dateFilter == item.day && monthFilter == monthTemp && yearFilter == yearTemp) ? {backgroundColor: "#003b95", borderRadius: 10}:{},
                        dateCurrentFilter != dateFilter && dateCurrentFilter === item.day &&
                        monthCurrentFilter == monthTemp && yearCurrentFilter == yearTemp &&
                        {
                            borderWidth: 1,
                            borderColor: "#003b95",
                            borderStyle: "solid",
                            borderRadius: 10
                            }
                        ]}
                        onPress={() => {
                            closeModalMonthSchedule()
                            setDateFilter(Number(item.day))
                            setMonthFilter(monthTemp)
                            setYearFilter(yearTemp)
                        }}
                    >
                        {item.day ? (
                        <Text style={[{ fontSize: 16 },
                            (dateFilter == item.day && monthFilter == monthTemp && yearFilter == yearTemp) && {color: "white"}
                        ]}>{item.day}</Text>
                        ) : (
                        <Text style={{ color: 'transparent' }}></Text>
                        )}
                    </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
} 