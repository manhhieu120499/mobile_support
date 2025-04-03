import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function({yearFilter, yearCurrentFilter, setYearFilter, closeModalYearSchedule, setWeekFilter}) {
    return (
        <View style={{flex: 1,height: "80%", paddingBottom: 15}}>
            <Text style={{fontSize: 17, textAlign: "center",
                paddingBottom: 12,
                paddingTop: 12,
                borderBottomColor: 'rgba(0,0,0, 0.2)',
                borderBottomWidth: 1,
                borderBottomStyle: "solid"
            }}>Chọn năm</Text>
            <TouchableOpacity style={[{flexDirection: "row", justifyContent: "center", alignItems: "center", 
                paddingVertical: 20,
                }, yearFilter == yearCurrentFilter - 1 && {backgroundColor: "rgba(0,0,0,0.2)"}]}
                onPress={() => {
                    setWeekFilter(1)
                    setYearFilter(yearCurrentFilter - 1);
                    closeModalYearSchedule()
                }}
            >
                <Text style={{fontSize: 18}}>{yearCurrentFilter - 1}</Text>                                
                {yearFilter == yearCurrentFilter - 1 && 
                <FontAwesomeIcon style={{
                    position: "absolute",
                    right: 15
                }} size={20} icon={faCheck} color="green" />}
            </TouchableOpacity>
            <TouchableOpacity style={[{flexDirection: "row", justifyContent: "center", alignItems: "center", 
                paddingVertical: 20,
                }, yearFilter == yearCurrentFilter && {backgroundColor: "rgba(0,0,0,0.2)"}]}
                onPress={() => {
                    setYearFilter(yearCurrentFilter);
                    closeModalYearSchedule()
                }}
            >
                <Text style={{fontSize: 18}}>{yearCurrentFilter}</Text>                                
                {yearFilter == yearCurrentFilter && 
                <FontAwesomeIcon style={{
                    position: "absolute",
                    right: 15
                }} size={20} icon={faCheck} color="green" />}
            </TouchableOpacity>
            <TouchableOpacity style={[{flexDirection: "row", justifyContent: "center", alignItems: "center", 
                paddingVertical: 20,
                }, yearFilter == yearCurrentFilter + 1 && {backgroundColor: "rgba(0,0,0,0.2)"}]}
                onPress={() => {
                    setYearFilter(yearCurrentFilter + 1);
                    closeModalYearSchedule()
                }}
            >
                <Text style={{fontSize: 18}}>{yearCurrentFilter + 1}</Text>                                
                {yearFilter == yearCurrentFilter + 1 && 
                <FontAwesomeIcon style={{
                    position: "absolute",
                    right: 15
                }} size={20} icon={faCheck} color="green" />}
            </TouchableOpacity>
        </View>
    )
}