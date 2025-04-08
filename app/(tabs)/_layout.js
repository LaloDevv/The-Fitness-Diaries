/* eslint-disable prettier/prettier */
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Image } from "react-native";
import colors from "../../constants/colors";
import icons from "../../constants/icons";
import strings from "../../constants/strings";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.darkBackground,
        },
        headerTitleAlign: "center",
        headerTitle: () => (
          <Text className="text-white text-xl font-semibold">
            {strings.appName}
          </Text>
        ),
        headerLeft: () => (
          <Image
            source={require("../../assets/images/tfd-logo-transparent.png")}
            className="w-16 h-16 ml-4"
            resizeMode="contain"
          />
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarStyle: {
          backgroundColor: colors.darkBackground,
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icons.home} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icons.history} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icons.profile} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
