import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import screen
import {
  Profile,
  CreateSchedule,
  Approve,
  ScheduleUser,
  InfoRoomRegister,
} from "../screens";

import Tabs from "./Tabs";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InfoRoomRegister"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
