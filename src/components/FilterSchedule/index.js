import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const style = StyleSheet.create({
    buttonFilter: {
        paddingHorizontal: 16,
        paddingVertical: 5
    },
    buttonActive: {
        backgroundColor: "#003b95",
        borderRadius: 7
    }
})

export default function FilterSchedule({openModalMonthSchedule, dayFilter, dateFilter, weekFilter, monthFilter, yearFilter
    , openModalWeekSchedule, openModalYearSchedule, setShowMonthSchedule,
    openModalMonthFilter, setShowWeekSchedule
}) {
    const [valueFilter, setValueFilter] = useState("Ngày");
    const formatDateMonthYear = () => {
        const date = dateFilter < 10 ? `0${dateFilter}` :`${dateFilter}`;
        const month = monthFilter < 10 ? `0${monthFilter}` :`${monthFilter}`;
        return `${dayFilter}, ${date}/${month}/${yearFilter}`
    }
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            {valueFilter === "Ngày" && 
                <TouchableOpacity style={{flexDirection: "row", padding: 5}}
                    onPress={openModalMonthSchedule}
                >
                    <Text>{formatDateMonthYear()}</Text>
                    <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} icon={faSortDown} />
                </TouchableOpacity>
            }
            {valueFilter === "Tuần" && 
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={{flexDirection: "row", padding: 5}} onPress={openModalYearSchedule}>
                        <Text>{yearFilter}</Text>
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} icon={faSortDown} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: "row", padding: 5, marginLeft: 5}} onPress={openModalWeekSchedule}>
                        <Text>{`Tuần ${weekFilter}`}</Text>
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} icon={faSortDown} />
                    </TouchableOpacity>
                </View>
            }
            {valueFilter === "Tháng" && 
                <TouchableOpacity style={{flexDirection: "row", padding: 5}}
                    onPress={openModalMonthFilter}
                >
                    <Text>{`Tháng ${monthFilter}, ${yearFilter}`}</Text>
                    <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} icon={faSortDown} />
                </TouchableOpacity>
            }
            <View style={{
                flexDirection: "row", 
                borderRadius: 7,
                backgroundColor: "white",
                height: 34,
                alignItems: "center",
                padding: 1
            }}>
                <TouchableOpacity style={[style.buttonFilter, 
                    valueFilter === "Ngày" && style.buttonActive
                ]}
                    onPress={() => {setValueFilter("Ngày"); setShowMonthSchedule(false); setShowWeekSchedule(false)}}
                >
                    <Text style={[{color: "#777"},
                        valueFilter === "Ngày" && {color: "#fff"}
                    ]}>Ngày</Text>
                </TouchableOpacity>
                <View style={{height: "70%", width: 1, backgroundColor: "#D6D6D6"}}></View>
                <TouchableOpacity style={[style.buttonFilter, 
                    valueFilter === "Tuần" && style.buttonActive
                ]}
                    onPress={() => {setValueFilter("Tuần"), setShowMonthSchedule(false); setShowWeekSchedule(true)}}
                >
                    <Text style={[{color: "#777"},
                        valueFilter === "Tuần" && {color: "#fff"}
                    ]}>Tuần</Text>
                </TouchableOpacity>
                <View style={{height: "70%", width: 1, backgroundColor: "#D6D6D6"}}></View>
                <TouchableOpacity style={[style.buttonFilter, 
                    valueFilter === "Tháng" && style.buttonActive
                ]}
                    onPress={() => {setValueFilter("Tháng"), setShowMonthSchedule(true); setShowWeekSchedule(false)}}
                >
                    <Text style={[{color: "#777"},
                        valueFilter === "Tháng" && {color: "#fff"}
                    ]}>Tháng</Text>
                </TouchableOpacity>
            </View>
        </View>

        
    )
}