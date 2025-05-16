/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Text, TextInput, Pressable, Alert, ScrollView, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import colors from "../constants/colors";
import strings from "../constants/strings";

export default function RegisterScreen() {
    const { register } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");

    const handleRegister = async () => {
        // Validaciones
        if (!email || !password || !repeatPassword || !name || !age || !height) {
            Alert.alert("Error", "Por favor, completa todos los campos.");
            return;
        }

        if (password !== repeatPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        const parsedAge = parseInt(age, 10);
        const parsedHeight = parseInt(height, 10);

        if (isNaN(parsedAge) || parsedAge <= 0) {
            Alert.alert("Error", "La edad debe ser un número positivo.");
            return;
        }

        if (isNaN(parsedHeight) || parsedHeight <= 0) {
            Alert.alert("Error", "La altura debe ser un número positivo.");
            return;
        }

        try {
            await register(email, password, {
                name: name.trim(),
                age: parsedAge,
                height: parsedHeight,
            });
            router.replace("/"); // Navegar al login
        } catch (error) {
            console.error("Error en el registro:", error);
            Alert.alert("Error", "No se pudo completar el registro.");
        }
    };

    return (
        <ScrollView className="px-4 pt-10"
            style={{ backgroundColor: colors.darkBackground }}
        >
            <View className="flex flex-row items-center mb-10">
                <Image
                    source={require("../assets/images/tfd-logo-transparent.png")}
                    className="w-16 h-16 ml-4"
                    resizeMode="contain"
                />
                <Text className="text-white text-xl font-semibold ml-6">
                    {strings.appName}
                </Text>
            </View>

            <Text className="text-white text-2xl italic font-bold mb-6 text-center">Join to our family!</Text>

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

            <TextInput
                placeholder="Repeat Password"
                placeholderTextColor="#ccc"
                className="border rounded px-4 py-2 mb-6 text-white"
                style={{ borderColor: colors.fitness.pastelYellow }}
                secureTextEntry
                value={repeatPassword}
                onChangeText={setRepeatPassword}
            />

            <TextInput
                placeholder="Name"
                placeholderTextColor="#ccc"
                className="border rounded px-4 py-2 mb-4 text-white"
                style={{ borderColor: colors.fitness.pastelYellow }}
                autoCapitalize="none"
                keyboardType="email-address"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Age"
                placeholderTextColor="#ccc"
                className="border rounded px-4 py-2 mb-4 text-white"
                style={{ borderColor: colors.fitness.pastelYellow }}
                autoCapitalize="none"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            <TextInput
                placeholder="Height (cm)"
                placeholderTextColor="#ccc"
                className="border rounded px-4 py-2 mb-4 text-white"
                style={{ borderColor: colors.fitness.pastelYellow }}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />

            <Pressable
                onPress={handleRegister}
                className="py-3 rounded items-center" style={{ backgroundColor: colors.fitness.pastelYellow }}
            >
                <Text className="text-black font-semibold">Registrarse</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/")} className="mt-4 items-center">
                <Text className="text-white">
                    ¿Ya tienes cuenta?{" "}
                    <Text className="text-blue-400 underline">Inicia sesión</Text>
                </Text>
            </Pressable>
        </ScrollView>
    );
}
