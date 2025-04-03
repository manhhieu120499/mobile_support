import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function({yearFilter, monthFilter, setMonthFilter, setYearFilter,
    closeModalMonthFilter
}) {
    const [yearTemp, setYearTemp] = useState(yearFilter);
    const monthOfYear = [1,2,3,4,5,6,7,8,9,10,11,12]
    return (
        <View style={{
            padding: 10
        }}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Text style={{
                    fontSize: 22,
                    fontWeight: 700
                }}>
                    {yearTemp}
                </Text>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity
                        onPress={() => {
                            setYearTemp(state => state - 1)
                        }}
                    >
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} size={30} icon={faCaretLeft} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            setYearTemp(state => state + 1)
                        }}>
                        <FontAwesomeIcon style={{marginTop: -2, marginLeft: 3}} size={30} icon={faCaretRight} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
                marginTop: 10
            }}>
                {monthOfYear.map((item, index) => (
                    <TouchableOpacity style={[{width: "30%",
                        padding: 10,
                        borderRadius: 10
                        }, item == monthFilter && yearTemp == yearFilter && {backgroundColor: "#003b95"}]} key={index}
                        onPress={() => {
                            setMonthFilter(Number(item));
                            setYearFilter(Number(yearTemp));
                            closeModalMonthFilter()
                        }}
                    >
                        <Text style={[{fontSize: 16, fontWeight: 600, textAlign: "center"},
                            item == monthFilter && yearTemp == yearFilter && {color: "white"}
                        ]}>{`Tháng ${item}`}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}