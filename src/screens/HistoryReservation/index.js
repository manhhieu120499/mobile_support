import { ScrollView, Text, View } from "react-native"
import Header from "../../layouts/components/Header";
import { useEffect, useState } from "react";
import { axiosConfig } from "../../utilities";
import ScheduleUserItem from "../../components/ScheduleUserItem";

const HistoryReservation = ({navigation, route}) => {
    const bookerId = route.params.bookerId;
    console.log(bookerId);
    
    const [listSchedule,setListSchedule] = useState([]);
    const handleFilterSchedule = async () => {
        try {
          const response = await axiosConfig().get(
            `/api/v1/requestForm/getRequestFormByBookerId?bookerId=${bookerId}`
          );

          const res = {};
          
          res.data = response.data.map((item) => {
            return item.reservations[0];
          })

          console.log(res.data);
          

          const groupDate = [];
          const result = [];
          res.data.sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart));
          res.data.forEach((item) => {
            const date = new Date(item.timeStart);
            const dateGroup = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            if(groupDate.indexOf(dateGroup) == -1) {
              groupDate.push(dateGroup);
            }
          })
          groupDate.forEach((group) => {
            const data = res.data.filter((item) => {
              const dateConvert = new Date(item.timeStart);
              return group === `${dateConvert.getDate()}/${dateConvert.getMonth() + 1}/${dateConvert.getFullYear()}`;
            })
            result.push({
              time: group,
              data
            })
          })
          console.log(result);
          
          setListSchedule(result)
        } catch (err) {
          console.log(err);
        }
    }
    // xử lý chuyển đến trang lịch chi tiết
    const handleTransferScreenScheduleDetail = ({infoScheduleRequest}) => {
      navigation.navigate("ScheduleDetailRequest", {
        infoScheduleRequest
      });
    }

    useEffect(() => {
        handleFilterSchedule();
    }, []);

    return (<View style={{flex: 1}}>
        <Header
            nameScreen="HistoryReservation"
            leftIcon={"chevron-left"}
            handleOnPressLeftIcon={() => navigation.goBack("")}
        ></Header>
        <View style={{flex: 1, backgroundColor: "red"}}>
            <ScrollView style={{flex: 1, backgroundColor:"#D6D6D6"}}>
                <View style={{
                    flex: 1,
                    backgroundColor: "white",
                    paddingBottom: 30
                }}>
                {listSchedule.map((item, index) => (
                    <ScheduleUserItem handleTransferScreenScheduleDetail={handleTransferScreenScheduleDetail} key={index} data={item} />
                ))}
                </View>
            </ScrollView>
        </View>
    </View>)
}

export default HistoryReservation;