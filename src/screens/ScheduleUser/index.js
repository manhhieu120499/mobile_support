import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import FilterSchedule from "../../components/FilterSchedule";
import MonthSchedule from "../../components/MonthSchedule";
import ModalBottom from "../../components/ModalBottom";
import "dayjs/locale/vi";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import WeekSchedule from "../../components/WeekSchedule";
import YearSchedule from "../../components/YearSchedule";
import isLeapYear from "dayjs/plugin/isLeapYear";
import MonthFilter from "../../components/MonthFilter";
import ScheduleUserItem from "../../components/ScheduleUserItem";
import { axiosConfig } from "../../utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);
dayjs.locale("vi");
const weekDays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];

const style = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#D6D6D6",
  },
});

export default function ScheduleUser({ navigation, route }) {
  const [valueFilter, setValueFilter] = useState("Ngày");
  const [isOpenModalMonthSchedule, setIsOpenModalMonthSchedule] =
    useState(false);
  const [isOpenModalWeekSchedule, setIsOpenModalWeekSchedule] = useState(false);
  const [isOpenModalYearSchedule, setIsOpenModalYearSchedule] = useState(false);
  const [isOpenModalMonthFilter, setIsOpenModalMonthFilter] = useState(false);
  const [showMonthSchedule, setShowMonthSchedule] = useState(false);
  const [showWeekSchedule, setShowWeekSchedule] = useState(false);
  const [listSchedule, setListSchedule] = useState([]);
  const [dayFilter, setDayFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [dateCurrentFilter, setDateCurrentFilter] = useState();
  const [monthCurrentFilter, setMonthCurrentFilter] = useState();
  const [yearCurrentFilter, setYearCurrentFilter] = useState();
  const [monthFilter, setMonthFilter] = useState();
  const [yearFilter, setYearFilter] = useState();
  const [startOfWeek, setStartOfWeek] = useState();
  const openModalMonthSchedule = () => {
    setIsOpenModalMonthSchedule(true);
  };
  const closeModalMonthSchedule = () => {
    setIsOpenModalMonthSchedule(false);
  };
  const openModalWeekSchedule = () => {
    setIsOpenModalWeekSchedule(true);
  };
  const closeModalWeekSchedule = () => {
    setIsOpenModalWeekSchedule(false);
  };
  const openModalYearSchedule = () => {
    setIsOpenModalYearSchedule(true);
  };
  const closeModalYearSchedule = () => {
    setIsOpenModalYearSchedule(false);
  };
  const openModalMonthFilter = () => {
    setIsOpenModalMonthFilter(true);
  };
  const closeModalMonthFilter = () => {
    setIsOpenModalMonthFilter(false);
  };
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
  const getDayOfWeek = (dayOfWeek) => {
    const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    return days[dayOfWeek];
  };
  const getWeek = () => {
    const days = dayjs(`${yearFilter}-${monthFilter}-${dateFilter}`);
    return Number(days.week());
  };
  const handleWeekFilterOnChange = (year, month, date, startOfWeekProp) => {
    const days = dayjs(`${year}-${month}-${date}`);
    setDayFilter(getDayOfWeek(days.day()));
    setDateFilter(days.date());
    setMonthFilter(days.month() + 1);
    setYearFilter(days.year());
    handleFilterSchedule(startOfWeekProp);
  };
  useEffect(() => {
    setDayFilter(getDayOfWeek(dayjs().day()));
    setDateFilter(dayjs().date());
    setDateCurrentFilter(dayjs().date());
    setYearCurrentFilter(dayjs().year());
    setMonthCurrentFilter(dayjs().month() + 1);
    setMonthFilter(dayjs().month() + 1);
    setYearFilter(dayjs().year());
  }, []);
  useEffect(() => {
    if (dateFilter) {
      const days = dayjs(`${yearFilter}-${monthFilter}-${dateFilter}`);
      setDayFilter(getDayOfWeek(days.day()));
      setDateFilter(days.date());
      setMonthFilter(days.month() + 1);
      setYearFilter(days.year());
      setStartOfWeek(
        dayjs(`${yearFilter}-01-01`)
          .startOf("week")
          .add(7 * (days.week() - 1), "day")
      );
      handleFilterSchedule();
    }
  }, [dateFilter, monthFilter, yearFilter]);
  useEffect(() => {
    setDayFilter(getDayOfWeek(dayjs().day()));
    setDateFilter(dayjs().date());
    setMonthFilter(dayjs().month() + 1);
    setYearFilter(dayjs().year());
    const days = dayjs(`${dayjs().year()}-01-01`)
      .startOf("week")
      .add(7 * (dayjs().week() - 1), "day");
    handleFilterSchedule(days);
  }, [valueFilter]);
  // Hàm lấy lịch đặt trước
  const handleFilterSchedule = async (startOfWeek) => {
    const employee = await getCurrentUser();
    const phone = employee.phone;

    let start = null;
    let end = null;

    try {
      if (valueFilter === "Ngày") {
        start = new Date(yearFilter, monthFilter - 1, dateFilter, 0, 0, 0);
        end = new Date(yearFilter, monthFilter - 1, dateFilter, 23, 59, 59);
      } else if (valueFilter === "Tuần") {
        start = new Date(
          startOfWeek.year(),
          startOfWeek.month(),
          startOfWeek.date(),
          0,
          0,
          0
        );
        const endOfWeek = startOfWeek.add(7, "day");

        end = new Date(
          endOfWeek.year(),
          endOfWeek.month(),
          endOfWeek.date(),
          0,
          0,
          0
        );
      } else if (valueFilter === "Tháng") {
        const daysInMonth = dayjs(`${yearFilter}-${monthFilter}-01`);
        const daysInMonthEnd = dayjs(
          `${yearFilter}-${monthFilter}-${daysInMonth.daysInMonth() + 1}`
        );

        start = new Date(
          daysInMonth.year(),
          daysInMonth.month(),
          daysInMonth.date(),
          0,
          0,
          0
        );
        console.log(daysInMonth);
        console.log(daysInMonthEnd);
        end = new Date(
          daysInMonthEnd.year(),
          daysInMonthEnd.month(),
          daysInMonthEnd.date(),
          0,
          0,
          0
        );
      }

      // console.log(`/api/v1/reservation/getAllReservationByBooker?phone=${phone}&dayStart=${start.toISOString()}&dayEnd=${end.toISOString()}`);

      const res = await axiosConfig().get(
        `/api/v1/reservation/getAllReservationByBooker?phone=${phone}&dayStart=${start.toISOString()}&dayEnd=${end.toISOString()}`
      );

      const groupDate = [];
      const result = [];
      res.data.sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart));
      res.data.forEach((item) => {
        const date = new Date(item.timeStart);
        const dateGroup = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        if (groupDate.indexOf(dateGroup) == -1) {
          groupDate.push(dateGroup);
        }
      });
      groupDate.forEach((group) => {
        const data = res.data.filter((item) => {
          const dateConvert = new Date(item.timeStart);
          return (
            group ===
            `${dateConvert.getDate()}/${
              dateConvert.getMonth() + 1
            }/${dateConvert.getFullYear()}`
          );
        });
        result.push({
          time: group,
          data,
        });
      });

      setListSchedule(result);
    } catch (err) {
      console.log(err);
    }
  };
  // Láy thông tin user
  const getCurrentUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userCurrent");

      if (jsonValue != null) {
        const user = JSON.parse(jsonValue);
        return user;
      }
    } catch (e) {
      console.error("Lỗi khi lấy current_user từ AsyncStorage", e);
      return null;
    }
  };
  // xử lý chuyển đến trang lịch chi tiết
  const handleTransferScreenScheduleDetail = ({ infoScheduleRequest }) => {
    navigation.navigate("ScheduleDetailRequest", {
      infoScheduleRequest,
    });
  };
  return (
    <DefaultLayout>
      <Header nameScreen="scheduleUser" />
      <View style={style.container}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#D6D6D6",
            padding: 10,
          }}
        >
          <FilterSchedule
            dayFilter={dayFilter}
            dateFilter={dateFilter}
            weekFilter={getWeek()}
            monthFilter={monthFilter}
            yearFilter={yearFilter}
            valueFilter={valueFilter}
            setValueFilter={setValueFilter}
            openModalMonthSchedule={openModalMonthSchedule}
            openModalWeekSchedule={openModalWeekSchedule}
            openModalYearSchedule={openModalYearSchedule}
            openModalMonthFilter={openModalMonthFilter}
            setShowMonthSchedule={setShowMonthSchedule}
            setShowWeekSchedule={setShowWeekSchedule}
          />
        </View>

        {showWeekSchedule && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 0,
              padding: 12,
            }}
          >
            {weekDays.map((day, index) => (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: "white",
                    borderRadius: 5,
                    alignItems: "center",
                    width: `${100 / 8}%`,
                    paddingVertical: 10,
                  },
                  weekDays.length != index && {
                    marginRight: `${100 / 8 / 6}%`,
                  },
                ]}
                key={index}
              >
                <Text
                  style={[
                    { width: 40, textAlign: "center" },
                    day === "Th 7" || day === "CN" ? { color: "red" } : {},
                  ]}
                >
                  {day}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 600 }}>
                  {startOfWeek?.add(index, "day").format("DD")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView style={{ flex: 1, backgroundColor: "#D6D6D6" }}>
          {showMonthSchedule && (
            <View
              style={{
                backgroundColor: "white",
                margin: 10,
                borderRadius: 5,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                {weekDays.map((day, index) => (
                  <Text
                    key={index}
                    style={[
                      { width: 40, textAlign: "center", fontWeight: "bold" },
                      day === "Th 7" || day === "CN" ? { color: "red" } : {},
                    ]}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              <FlatList
                data={getDaysInMonth(yearFilter, monthFilter)}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={7}
                scrollEnabled={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      {
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                      dateCurrentFilter === item.day &&
                        monthCurrentFilter == monthFilter &&
                        yearCurrentFilter == yearFilter && {
                          borderWidth: 1,
                          borderColor: "#003b95",
                          borderStyle: "solid",
                          borderRadius: 10,
                        },
                    ]}
                  >
                    {item.day ? (
                      <Text style={{ fontSize: 16 }}>{item.day}</Text>
                    ) : (
                      <Text style={{ color: "transparent" }}></Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingBottom: 30,
            }}
          >
            {listSchedule.map((item, index) => (
              <ScheduleUserItem
                handleTransferScreenScheduleDetail={
                  handleTransferScreenScheduleDetail
                }
                key={index}
                data={item}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <ModalBottom
        isOpenModal={isOpenModalMonthSchedule}
        closeModal={closeModalMonthSchedule}
      >
        <MonthSchedule
          dateFilter={dateFilter}
          dateCurrentFilter={dateCurrentFilter}
          monthCurrentFilter={monthCurrentFilter}
          yearCurrentFilter={yearCurrentFilter}
          weekFilter={getWeek()}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setDateFilter={setDateFilter}
          setMonthFilter={setMonthFilter}
          setYearFilter={setYearFilter}
          closeModalMonthSchedule={closeModalMonthSchedule}
        />
      </ModalBottom>
      <ModalBottom
        padding={0}
        heightTop="10%"
        isOpenModal={isOpenModalWeekSchedule}
        closeModal={closeModalWeekSchedule}
      >
        <WeekSchedule
          dateFilter={dateFilter}
          weekFilter={getWeek()}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          handleWeekFilterOnChange={handleWeekFilterOnChange}
          closeModalWeekSchedule={closeModalWeekSchedule}
        />
      </ModalBottom>
      <ModalBottom
        padding={0}
        isOpenModal={isOpenModalYearSchedule}
        closeModal={closeModalYearSchedule}
      >
        <YearSchedule
          dateFilter={dateFilter}
          yearCurrentFilter={yearCurrentFilter}
          weekFilter={getWeek()}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          closeModalYearSchedule={closeModalYearSchedule}
        />
      </ModalBottom>
      <ModalBottom
        padding={0}
        isOpenModal={isOpenModalMonthFilter}
        closeModal={closeModalMonthFilter}
      >
        <MonthFilter
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setMonthFilter={setMonthFilter}
          setYearFilter={setYearFilter}
          closeModalMonthFilter={closeModalMonthFilter}
        />
      </ModalBottom>
    </DefaultLayout>
  );
}
