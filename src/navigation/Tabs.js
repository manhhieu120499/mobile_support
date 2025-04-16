import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";

// import screens
import { Profile, CreateSchedule, Approve, ScheduleUser } from "../screens";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: "#096aec",
  tabBarInactiveTintColor: "#8d8d8d",
  tabBarStyle: {
    backgroundColor: "white",
    borderTopColor: "#e7e7e7",
  },
  tabBarIcon: ({ focused, color, size }) => {
    const tabs = {
      CreateSchedule: {
        icon: (
          <FontAwesomeIcon
            name="calendar"
            color={focused == true ? "#096aec" : "gray"}
            size={20}
          />
        ),
      },
      Approve: {
        icon: (
          <FontAwesomeIcon
            name="circle-check"
            color={focused == true ? "#096aec" : "gray"}
            size={20}
          />
        ),
      },
      ScheduleUser: {
        icon: (
          <FontAwesomeIcon
            name="calendar-check"
            color={focused == true ? "#096aec" : "gray"}
            size={20}
          />
        ),
      },
      Profile: {
        icon: (
          <FontAwesomeIcon
            name="circle-user"
            color={focused == true ? "#096aec" : "gray"}
            size={20}
          />
        ),
      },
    };
    return tabs[route.name].icon;
  },
});

export default function Tabs({ navigation, route }) {
  // thông tin user
  const [userCurrent, setUserCurrent] = useState({
    role: "USER",
    sub: "0900000000",
    userName: "0900000000",
  });

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("userCurrent");
      const userParse = JSON.parse(data);
      setUserCurrent({
        role: userParse.role,
        sub: userParse.sub,
        userName: userParse.userName,
      });
    })();
  }, []);

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
      {userCurrent.role == "APPROVER" && (
        <Tab.Screen
          name="Approve"
          component={Approve}
          options={{
            tabBarLabel: "Phê duyệt",
            tabBarLabelStyle: {
              fontSize: 12,
            },
          }}
        />
      )}
      <Tab.Screen
        name="ScheduleUser"
        component={ScheduleUser}
        options={{
          tabBarLabel: "Lịch cá nhân",
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
