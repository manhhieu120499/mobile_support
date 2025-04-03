import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { DefaultLayout } from "../../layouts";
import Header from "../../layouts/components/Header";
import FilterSchedule from "../../components/FilterSchedule";
import MonthSchedule from "../../components/MonthSchedule";
import ModalBottom from "../../components/ModalBottom";
import 'dayjs/locale/vi'; 
import dayjs from "dayjs"
import weekOfYear from 'dayjs/plugin/weekOfYear';
import WeekSchedule from "../../components/WeekSchedule";
import YearSchedule from "../../components/YearSchedule";
import isLeapYear from 'dayjs/plugin/isLeapYear';
import MonthFilter from "../../components/MonthFilter";
import ScheduleUserItem from "../../components/ScheduleUserItem";
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);
dayjs.locale('vi');
const weekDays = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

const style = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#D6D6D6",
  },
});

export default function ScheduleUser({ navigation, route }) {
  const [isOpenModalMonthSchedule, setIsOpenModalMonthSchedule] = useState(false);
  const [isOpenModalWeekSchedule, setIsOpenModalWeekSchedule] = useState(false);
  const [isOpenModalYearSchedule, setIsOpenModalYearSchedule] = useState(false);
  const [isOpenModalMonthFilter, setIsOpenModalMonthFilter] = useState(false);
  const [showMonthSchedule, setShowMonthSchedule] = useState(false);
  const [showWeekSchedule, setShowWeekSchedule] = useState(false);
  const [dayFilter, setDayFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [dateCurrentFilter, setDateCurrentFilter] = useState();
  const [monthCurrentFilter, setMonthCurrentFilter] = useState();
  const [yearCurrentFilter, setYearCurrentFilter] = useState();
  const [weekFilter, setWeekFilter] = useState();
  const [monthFilter, setMonthFilter] = useState();
  const [yearFilter, setYearFilter] = useState();
  const [startOfWeek, setStartOfWeek] = useState();
  const openModalMonthSchedule = () => {
    setIsOpenModalMonthSchedule(true);
  }
  const closeModalMonthSchedule = () => {
    setIsOpenModalMonthSchedule(false);
  }
  const openModalWeekSchedule = () => {
    setIsOpenModalWeekSchedule(true);
  }
  const closeModalWeekSchedule = () => {
    setIsOpenModalWeekSchedule(false);
  }
  const openModalYearSchedule = () => {
    setIsOpenModalYearSchedule(true);
  }
  const closeModalYearSchedule = () => {
    setIsOpenModalYearSchedule(false);
  }
  const openModalMonthFilter = () => {
    setIsOpenModalMonthFilter(true);
  }
  const closeModalMonthFilter = () => {
    setIsOpenModalMonthFilter(false);
  }
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
  const getFormattedDate = () => {
    const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    const dayOfWeek = days[dayjs().day()];
    return `${dayOfWeek}, ${dayjs().format('DD/MM/YYYY')}`;
  };
  const getDayOfWeek = (dayOfWeek) => {
    const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    return days[dayOfWeek];
  }
  useEffect(() => {
    setDayFilter(getDayOfWeek(dayjs().day()));
    setDateFilter(dayjs().date());
    setDateCurrentFilter(dayjs().date());
    setYearCurrentFilter(dayjs().year());
    setMonthCurrentFilter(dayjs().month() + 1);
    setWeekFilter(dayjs().week());
    setMonthFilter(dayjs().month() + 1);
    setYearFilter(dayjs().year());
  }, [])
  useEffect(() => {
    if(dateFilter) {
      const days = dayjs(`${yearFilter}-${monthFilter}-${dateFilter}`);
      setDayFilter(getDayOfWeek(days.day()));
      setDateFilter(days.date());
      setWeekFilter(days.week());
      setMonthFilter(days.month() + 1);
      setYearFilter(days.year());
      setStartOfWeek(dayjs(`${yearFilter}-01-01`).startOf("week").add(7 * (weekFilter - 1), "day"))
    }
  }, [dateFilter, monthFilter, yearFilter])
  useEffect(() => {
    setStartOfWeek(dayjs(`${yearFilter}-01-01`).startOf("week").add(7 * (weekFilter - 1), "day"))
  }, [weekFilter])
  return (
    <DefaultLayout>
      <Header nameScreen="scheduleUser" />
      <View style={style.container}>
        <View style={{
          width: "100%",
          backgroundColor: "#D6D6D6",
          padding: 10
        }}>
          <FilterSchedule 
            dayFilter={dayFilter}
            dateFilter={dateFilter}
            weekFilter={weekFilter}
            monthFilter={monthFilter}
            yearFilter={yearFilter}
            openModalMonthSchedule={openModalMonthSchedule}
            openModalWeekSchedule={openModalWeekSchedule}
            openModalYearSchedule={openModalYearSchedule}
            openModalMonthFilter={openModalMonthFilter}
            setShowMonthSchedule={setShowMonthSchedule}
            setShowWeekSchedule={setShowWeekSchedule}
          />
        </View>
        <ScrollView style={{flex: 1, backgroundColor:"#D6D6D6"}}>
          {showMonthSchedule && 
            <View style={{
              backgroundColor: "white",
              margin: 10,
              borderRadius: 5,
              padding: 10}}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                {weekDays.map((day, index) => (
                  <Text key={index} style={[{ width: 40, textAlign: 'center', fontWeight: 'bold' },
                      day === "Th 7" || day === "CN" ? {color: "red"} : {}
                  ]}>
                      {day}
                  </Text>
                ))}
              </View>
              
              <FlatList
                data={getDaysInMonth(yearFilter, monthFilter)}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                numColumns={7}
                scrollEnabled={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                <TouchableOpacity style={[{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center'},
                    dateCurrentFilter === item.day &&
                    monthCurrentFilter == monthFilter && yearCurrentFilter == yearFilter &&
                    {
                        borderWidth: 1,
                        borderColor: "#003b95",
                        borderStyle: "solid",
                        borderRadius: 10
                        }
                    ]}
                >
                    {item.day ? (
                    <Text style={{ fontSize: 16 }}>{item.day}</Text>
                    ) : (
                    <Text style={{ color: 'transparent' }}></Text>
                    )}
                </TouchableOpacity>
                )}
              />
            </View>
          }
          {showWeekSchedule && <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 0, padding: 12 }}>
            {weekDays.map((day, index) => (
              <TouchableOpacity style={{backgroundColor: "white", borderRadius: 5,
                alignItems: "center",
                padding: 5,
                paddingVertical: 10
              }} key={index}>
                <Text  style={[{ width: 40, textAlign: 'center'},
                    day === "Th 7" || day === "CN" ? {color: "red"} : {}
                ]}>
                    {day}
                </Text>
                <Text style={{marginTop: 5, fontSize: 16, fontWeight: 600}}>
                  {startOfWeek?.add(index, "day").format("DD")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>}
          <View style={{
            flex: 1,
            height: 1000,
            backgroundColor: "white",
          }}>
            <ScheduleUserItem />
            <ScheduleUserItem />
            <ScheduleUserItem />
          </View>
        </ScrollView>
      </View>
      <ModalBottom isOpenModal={isOpenModalMonthSchedule} closeModal={closeModalMonthSchedule}>
        <MonthSchedule
          dateFilter={dateFilter}
          dateCurrentFilter={dateCurrentFilter}
          monthCurrentFilter={monthCurrentFilter}
          yearCurrentFilter={yearCurrentFilter}
          weekFilter={weekFilter}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setDateFilter={setDateFilter}
          setMonthFilter={setMonthFilter}
          setYearFilter={setYearFilter}
          closeModalMonthSchedule={closeModalMonthSchedule}
        />
      </ModalBottom>
      <ModalBottom padding={0} heightTop="10%" isOpenModal={isOpenModalWeekSchedule} closeModal={closeModalWeekSchedule}>
        <WeekSchedule
          dateFilter={dateFilter}
          weekFilter={weekFilter}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setWeekFilter={setWeekFilter}
          closeModalWeekSchedule={closeModalWeekSchedule}
        />
      </ModalBottom>
      <ModalBottom padding={0} isOpenModal={isOpenModalYearSchedule} closeModal={closeModalYearSchedule}>
        <YearSchedule
          dateFilter={dateFilter}
          yearCurrentFilter={yearCurrentFilter}
          weekFilter={weekFilter}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          setWeekFilter={setWeekFilter}
          setYearFilter={setYearFilter}
          closeModalYearSchedule={closeModalYearSchedule}
        />
      </ModalBottom>
      <ModalBottom padding={0} isOpenModal={isOpenModalMonthFilter} closeModal={closeModalMonthFilter}>
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
