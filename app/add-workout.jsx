/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import WorkoutForm from "../components/forms/WorkoutForm";
import colors from "../constants/colors";

export default function AddWorkout() {
  const { addWorkout } = useUser();
  const router = useRouter();

  return (
    <View className="flex-1 px-4 pt-4" style={{ backgroundColor: colors.darkBackground }}>
      {/* Header */}
      <View className="flex-row items-center mb-6 mt-2">
        <Pressable onPress={() => router.back()} className="mr-2">
          <ArrowLeft size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">
          Add Workout
        </Text>
      </View>

      {/* Reusable Form */}
      <WorkoutForm
        mode="add"
        onSubmit={(workout) => addWorkout(workout)}
      />
    </View>
  );
}
