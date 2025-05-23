import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screen
import {
  Profile,
  CreateSchedule,
  Approve,
  ScheduleUser,
  InfoRoomRegister,
  QRScan,
  ScheduleDetailRoom,
  Schedule,
  TimeLine,
  RoomDetail,
  ScheduleDetailRequest,
  Login,
} from "../screens";

import Tabs from "./Tabs";
import HistoryReservation from "../screens/HistoryReservation";
import Notification from "../screens/Notification/Notification";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="CreateSchedule" component={CreateSchedule} />
        <Stack.Screen name="Approve" component={Approve} />
        <Stack.Screen name="ScheduleUser" component={ScheduleUser} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="InfoRoomRegister" component={InfoRoomRegister} />
        <Stack.Screen name="QRScan" component={QRScan} />
        <Stack.Screen
          name="ScheduleDetailRoom"
          component={ScheduleDetailRoom}
        />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="TimeLine" component={TimeLine} />
        <Stack.Screen name="RoomDetail" component={RoomDetail} />
        <Stack.Screen
          name="ScheduleDetailRequest"
          component={ScheduleDetailRequest}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HistoryReservation" component={HistoryReservation} />
        <Stack.Screen name="Notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
