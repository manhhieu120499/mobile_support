import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";

// import screens
import { Profile, CreateSchedule } from "../screens";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "gray",
  tabBarStyle: {
    backgroundColor: "#101010",
    borderTopColor: "#333",
  },
  tabBarIcon: ({ focused, color, size }) => {
    const tabs = {
      CreateSchedule: {
        icon: (
          <FontAwesomeIcon
            name="calendar"
            color={focused == true ? "white" : "gray"}
            size={20}
          />
        ),
      },
      Profile: {
        icon: (
          <FontAwesomeIcon
            name="circle-user"
            color={focused == true ? "white" : "gray"}
            size={20}
          />
        ),
      },
    };
    return tabs[route.name].icon;
  },
});

export default function Tabs({ navigation, route }) {
  return (
    <Tab.Navigator
      initialRouteName="CreateSchedule"
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="CreateSchedule"
        component={CreateSchedule}
        options={{
          tabBarLabel: "Đặt lịch",
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Hồ sơ",
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
    </Tab.Navigator>
  );
}
