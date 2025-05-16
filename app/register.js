/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import colors from "../constants/colors";

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
      Alert.alert("Registro exitoso", "Ya puedes iniciar sesión.");
      router.replace("/"); // Navegar al login
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "No se pudo completar el registro.");
    }
  };

  return (
    <ScrollView className="flex-1 px-4 pt-10" style={{ backgroundColor: colors.darkBackground }}>
      <Text className="text-white text-2xl font-bold mb-6 text-center">Crear Cuenta</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-white rounded p-2 mb-4 text-white"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-white rounded p-2 mb-4 text-white"
      />

      <TextInput
        placeholder="Repite la contraseña"
        placeholderTextColor="#ccc"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
        className="border border-white rounded p-2 mb-4 text-white"
      />

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
        className="border border-white rounded p-2 mb-4 text-white"
      />

      <TextInput
        placeholder="Edad"
        placeholderTextColor="#ccc"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        className="border border-white rounded p-2 mb-4 text-white"
      />

      <TextInput
        placeholder="Altura (cm)"
        placeholderTextColor="#ccc"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        className="border border-white rounded p-2 mb-6 text-white"
      />

      <Pressable
        onPress={handleRegister}
        className="bg-white py-3 rounded items-center"
      >
        <Text className="text-black font-semibold">Registrarse</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/")} className="mt-4 items-center">
        <Text className="text-gray-300">¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
