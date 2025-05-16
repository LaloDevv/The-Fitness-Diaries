/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import colors from "../constants/colors";
import strings from "../constants/strings";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email.trim(), password);
      Toast.show({ type: "success", text1: "Logged in!" });
      console.log("Logged in successfully");
      router.replace("/(tabs)"); // Ir a tabs al iniciar sesión
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Login failed", text2: err.message });
    }
  };

  return (
    <View className="flex-1 justify-center px-6" style={{ backgroundColor: colors.darkBackground }}>

      <View className="flex flex-row items-center mt-10">
        <Image
          source={require("../assets/images/tfd-logo-transparent.png")}
          className="w-16 h-16 ml-4"
          resizeMode="contain"
        />
        <Text className="text-white text-xl font-semibold ml-6">
          {strings.appName}
        </Text>
      </View>

      <View className="flex-1 justify-center px-6" style={{ backgroundColor: colors.darkBackground }}>
        <Text className="text-white text-xl italic font-bold mb-6 text-center">{strings.introText}</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          className="border rounded px-4 py-2 mb-4 text-white"
          style={{ borderColor: colors.fitness.pastelYellow }}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          className="border rounded px-4 py-2 mb-6 text-white"
          style={{ borderColor: colors.fitness.pastelYellow }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable onPress={handleLogin} className="py-3 rounded items-center" style={{ backgroundColor: colors.fitness.pastelYellow }}>
          <Text className="text-black font-semibold">Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")} className="mt-4 items-center">
          <Text className="text-white">
            ¿No tienes cuenta?{" "}
            <Text className="text-blue-400 underline">Regístrate</Text>
          </Text>
        </Pressable>
        
      </View>
    </View>
  );
}
