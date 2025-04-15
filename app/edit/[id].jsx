/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { ArrowLeft } from "lucide-react-native";
import WorkoutForm from "../../components/forms/WorkoutForm";
import colors from "../../constants/colors";

/***********************************************************
* Description: EditWorkout screen wrapper                  *
* args: dynamic id from route                              *
* Output: Header + WorkoutForm in 'edit' mode              *
***********************************************************/
export default function EditWorkout() {
  const { id } = useLocalSearchParams();
  const { user, updateWorkout } = useUser();
  const router = useRouter();

  const workout = user.workouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.darkBackground }}>
        <Text className="text-white font-semibold text-lg">Workout not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-4" style={{ backgroundColor: colors.darkBackground }}>
      {/* Header */}
      <View className="flex-row items-center mb-6 mt-4">
        <Pressable onPress={() => router.back()} className="mr-2">
          <ArrowLeft size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">
          Edit Workout
        </Text>
      </View>

      {/* Reusable Form with initial values */}
      <WorkoutForm
        mode="edit"
        initialWorkout={workout}
        onSubmit={(updatedWorkout) =>
          updateWorkout({ ...updatedWorkout, id: workout.id })
        }
      />
    </View>
  );
}
