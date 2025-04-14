/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import Toast from "react-native-toast-message";
import colors from "../../constants/colors";
import { ArrowLeft } from "lucide-react-native";

export default function StartWorkout() {
  const { id } = useLocalSearchParams();
  const { user, addWorkoutSession } = useUser();
  const router = useRouter();

  const workout = user.workouts.find((w) => w.id === id);

  /***********************************************************
  * Description: Initializes the session from the selected workout
  * args: none
  * Output: State array of exercises with initialized sets
  ***********************************************************/
  const [session, setSession] = useState(
    workout.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      name: exercise.name,
      sets: Array.from({ length: exercise.sets }).map((_, index) => ({
        id: `set${index + 1}`,
        weight: 0,
        reps: 0,
        completed: false,
      })),
    }))
  );

  /***********************************************************
  * Description: Updates a field (weight or reps) in a specific set
  * args:
  *   - exerciseIndex: number
  *   - setIndex: number
  *   - field: "weight" | "reps"
  *   - value: string
  * Output: Updates session state with clamped numeric value
  ***********************************************************/
  const handleChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...session];
    const numericValue = Math.max(0, parseInt(value) || 0);
    updated[exerciseIndex].sets[setIndex][field] = numericValue;
    setSession(updated);
  };

  /***********************************************************
  * Description: Opens a confirmation alert before saving session
  * args: none
  * Output: Triggers saveSession on confirmation
  ***********************************************************/
  const handleSubmitConfirm = () => {
    Alert.alert(
      "Confirm Session",
      "Are you sure you want to save this workout session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", style: "default", onPress: saveSession },
      ]
    );
  };

  /***********************************************************
  * Description: Saves session data into context and goes back
  * args: none
  * Output: Updates global state and shows success toast
  ***********************************************************/
  const saveSession = () => {
    addWorkoutSession({
      weekNumber: user.weightEntries.length + 1,
      exercises: session,
    });

    Toast.show({
      type: "success",
      text1: "Workout session saved!",
    });

    router.back();
  };

  /***********************************************************
  * Description: Adds a new set to a given exercise
  * args:
  *   - exerciseIndex: number
  * Output: Updates session state with a new set
  ***********************************************************/
  const handleAddSet = (exerciseIndex) => {
    const updated = [...session];
    const newSet = {
      id: `set${updated[exerciseIndex].sets.length + 1}`,
      weight: 0,
      reps: 0,
      completed: false,
    };
    updated[exerciseIndex].sets.push(newSet);
    setSession(updated);
  };

  /***********************************************************
  * Description: Renders each exercise card inside the FlatList
  * args: item (exercise), index (exerciseIndex)
  * Output: JSX for that workout exercise block
  ***********************************************************/
  const renderExercise = ({ item, index: exerciseIndex }) => (
    <View
      key={item.exerciseId}
      className="mb-6 border rounded-md p-4"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.fitness.pastelYellow,
      }}
    >
      <Text
        className="text-lg font-semibold mb-2"
        style={{ color: colors.fitness.pastelYellow }}
      >
        {item.name}
      </Text>

      {item.sets.map((set, setIndex) => (
        <View
          key={`${item.exerciseId}-set${setIndex}`}
          className="flex-row mb-3"
        >
          <Text className="text-white text-sm italic font-bold mr-2">
            Set {setIndex + 1}:
          </Text>

          <View className="flex-1 mr-2">
            <Label>Weight (kg)</Label>
            <Input
              keyboardType="numeric"
              className="border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
              value={set.weight.toString()}
              onChangeText={(val) =>
                handleChange(exerciseIndex, setIndex, "weight", val)
              }
            />
          </View>

          <View className="flex-1">
            <Label>Reps</Label>
            <Input
              keyboardType="numeric"
              className="border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
              value={set.reps.toString()}
              onChangeText={(val) =>
                handleChange(exerciseIndex, setIndex, "reps", val)
              }
            />
          </View>
        </View>
      ))}

      <View className="bg-yellow-200 rounded-md">
        <Button
          onPress={() => handleAddSet(exerciseIndex)}
          className="mt-2 self-end"
        >
          <Text className="text-sm font-semibold text-black">+ Add Set</Text>
        </Button>
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.darkBackground }}>
      <FlatList
        ListHeaderComponent={
          <View className="p-4">
            <View className="flex-row items-center mt-4">
              <Pressable onPress={() => router.back()} className="mr-2">
                <ArrowLeft size={24} color="white" />
              </Pressable>
              <Text className="text-2xl font-bold text-white">
                {workout?.name}
              </Text>
            </View>
          </View>
        }
        data={session}
        keyExtractor={(item) => item.exerciseId}
        renderItem={renderExercise}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 45 }}
      />

      {/* Fixed Save Button */}
      <View
        className="p-1 rounded-lg mx-16 mb-4 absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: colors.fitness.yellow }}
      >
        <Button onPress={handleSubmitConfirm}>
          <Text className="text-black font-semibold text-sm">
            Save Session! 🚀​
          </Text>
        </Button>
      </View>
    </View>
  );
}
