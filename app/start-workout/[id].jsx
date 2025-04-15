/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from "react";
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
import strings from "../../constants/strings";
import { ArrowLeft } from "lucide-react-native";
import { twMerge } from "tailwind-merge";

export default function StartWorkout() {
  const { id } = useLocalSearchParams();
  const { user, addWorkoutSession } = useUser();
  const router = useRouter();
  const [inputErrors, setInputErrors] = useState({});

  const workout = user.workouts.find((w) => w.id === id);

  /***********************************************************
  * Description: Initializes the session from the workout   *
  * Output: session state with exercises and set fields     *
  * Note: weight/reps are stored as strings for safe input  *
  ***********************************************************/
  const [session, setSession] = useState(
    workout.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      name: exercise.name,
      sets: Array.from({ length: exercise.sets }).map((_, index) => ({
        id: `set${index + 1}`,
        weight: "0",
        reps: "0",
        completed: false,
      })),
    }))
  );

  /***********************************************************
  * Description: Updates weight/reps fields in state        *
  * Memoized to prevent re-creating on every render         *
  * args: exerciseIndex, setIndex, field, value             *
  ***********************************************************/
  const handleChange = useCallback((exerciseIndex, setIndex, field, value) => {
    const updated = [...session];
    updated[exerciseIndex].sets[setIndex][field] = value;

    const isNegative = parseFloat(value) < 0;
    const errorKey = `${exerciseIndex}-${setIndex}-${field}`;

    setInputErrors((prev) => ({
      ...prev,
      [errorKey]: isNegative
        ? `${field === "weight" ? "Weight" : "Reps"} must be 0 or higher`
        : undefined,
    }));

    setSession(updated);
  }, [session]);

  /***********************************************************
  * Description: Adds a new empty set to the given exercise *
  * Memoized to prevent re-creation                         *
  * args: exerciseIndex (number)                            *
  ***********************************************************/
  const handleAddSet = useCallback((exerciseIndex) => {
    const updated = [...session];
    const newSet = {
      id: `set${updated[exerciseIndex].sets.length + 1}`,
      weight: "0",
      reps: "0",
      completed: false,
    };
    updated[exerciseIndex].sets.push(newSet);
    setSession(updated);
  }, [session]);

  /***********************************************************
  * Description: Triggers a confirmation alert              *
  * args: none                                              *
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
  * Description: Parses values and saves the workout        *
  * args: none                                              *
  * Output: updates context and shows toast                 *
  ***********************************************************/
  const saveSession = () => {
    const hasErrors = Object.values(inputErrors).some(Boolean);
    if (hasErrors) {
      Toast.show({
        type: "error",
        text1: "Fix input errors before saving",
      });
      return;
    }

    const parsedSession = session.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        ...set,
        weight: Math.max(0, parseFloat(set.weight) || 0),
        reps: Math.max(0, parseInt(set.reps) || 0),
      })),
    }));

    addWorkoutSession({ exercises: parsedSession });

    Toast.show({
      type: "success",
      text1: strings.successAddSession,
    });

    router.back();
  };

  /***********************************************************
  * Description: Renders each exercise block                *
  * Memoized for FlatList optimization                      *
  ***********************************************************/
  const renderExercise = useCallback(({ item, index: exerciseIndex }) => (
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
              keyboardType="decimal-pad"
              className={twMerge(
                "border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200",
                inputErrors[`${exerciseIndex}-${setIndex}-weight`] ? "border-red-500" : ""
              )}
              value={set.weight}
              onChangeText={(val) =>
                handleChange(exerciseIndex, setIndex, "weight", val)
              }
            />
            {inputErrors[`${exerciseIndex}-${setIndex}-weight`] && (
              <Text className="text-red-500 text-xs mt-1">
                {inputErrors[`${exerciseIndex}-${setIndex}-weight`]}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Label>Reps</Label>
            <Input
              keyboardType="number-pad"
              className={twMerge(
                "border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200",
                inputErrors[`${exerciseIndex}-${setIndex}-reps`] ? "border-red-500" : ""
              )}
              value={set.reps}
              onChangeText={(val) =>
                handleChange(exerciseIndex, setIndex, "reps", val)
              }
            />
            {inputErrors[`${exerciseIndex}-${setIndex}-reps`] && (
              <Text className="text-red-500 text-xs mt-1">
                {inputErrors[`${exerciseIndex}-${setIndex}-reps`]}
              </Text>
            )}
          </View>
        </View>
      ))}

      <View className="bg-yellow-200 rounded-md">
        <Button onPress={() => handleAddSet(exerciseIndex)}>
          <Text className="text-sm font-semibold text-black">+ Add Set</Text>
        </Button>
      </View>
    </View>
  ), [session, inputErrors, handleChange, handleAddSet]);

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

      <View
        className="p-1 rounded-lg mx-16 mb-4 absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: colors.fitness.yellow }}
      >
        <Button onPress={handleSubmitConfirm}>
          <Text className="text-black font-semibold text-sm">
            Save Session! 🚀
          </Text>
        </Button>
      </View>
    </View>
  );
}
