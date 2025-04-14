/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import Toast from "react-native-toast-message";
import { Plus, Trash2, ArrowLeft } from "lucide-react-native";
import colors from "../constants/colors";

/***********************************************************
* Description: Add Workout screen                          *
* args: none                                               *
* Output: Form to create new workout and exercises         *
***********************************************************/
export default function AddWorkout() {
  const { addWorkout } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([{ name: "", sets: 3, reps: 10 }]);

  /***********************************************************
  * Description: Adds a new exercise input block             *
  * args: none                                               *
  * Output: Appends an empty exercise to the exercises state *
  ***********************************************************/
  const handleAddExercise = () => {
    setExercises((prev) => [...prev, { name: "", sets: 3, reps: 10 }]);
  };

  /***********************************************************
  * Description: Removes an exercise from the list           *
  * args:                                                    *
  *   - index: number → index of the exercise to remove      *
  * Output: Filters the exercise out from state              *
  ***********************************************************/
  const handleRemoveExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  /***********************************************************
  * Description: Updates a specific field in an exercise     *
  * args:                                                    *
  *   - index: number → exercise index                       *
  *   - field: string → 'name', 'sets', or 'reps'            *
  *   - value: string → input value from TextInput           *
  * Output: Updates the state of the targeted exercise       *
  ***********************************************************/
  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] =
      field === "sets" || field === "reps"
        ? Math.max(0, parseInt(value) || 0)
        : value;
    setExercises(updated);
  };

  /***********************************************************
  * Description: Saves the new workout and navigates back    *
  * args: none                                               *
  * Output: Updates global state, shows toast, navigates     *
  ***********************************************************/
  const handleSubmit = () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Workout name is required" });
      return;
    }

    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) {
      Toast.show({ type: "error", text1: "At least one exercise is required" });
      return;
    }

    addWorkout({
      name,
      exercises: validExercises,
    });

    Toast.show({ type: "success", text1: "Workout added!" });
    router.back();
  };

  /***********************************************************
  * Description: Renders each exercise card in the list      *
  * args:                                                    *
  *   - item: object → exercise item                         *
  *   - index: number → index of the exercise                *
  * Output: JSX element for FlatList renderItem              *
  ***********************************************************/
  const renderExercise = ({ item, index }) => (
    <View key={index} className="mb-2 p-4 rounded-lg border" style={{ borderColor: colors.fitness.pastelYellow,
        backgroundColor: colors.cardBackground
     }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold" style={{ color: colors.fitness.pastelYellow }}>
          Exercise {index + 1}
        </Text>
        <Pressable onPress={() => handleRemoveExercise(index)}>
          <Trash2 size={20} color="#f87171" />
        </Pressable>
      </View>

      <Label>Exercise Name</Label>
      <Input
        value={item.name}
        onChangeText={(val) => handleChange(index, "name", val)}
        placeholder="e.g. Bench Press"
        className="border-white mb-3 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
      />

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Label>Sets</Label>
          <Input
            keyboardType="numeric"
            value={item.sets.toString()}
            onChangeText={(val) => handleChange(index, "sets", val)}
            className="border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
          />
        </View>
        <View className="flex-1">
          <Label>Reps</Label>
          <Input
            keyboardType="numeric"
            value={item.reps.toString()}
            onChangeText={(val) => handleChange(index, "reps", val)}
            className="border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
          />
        </View>
      </View>
    </View>
  );

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

      <Label>Workout Name</Label>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="e.g. Push Day"
        className="border-white mb-6 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
      />

      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderExercise}
        ListFooterComponent={
          <View className="mb-4">
            <Button onPress={handleAddExercise} className="mb-6">
              <View className="flex-row items-center p-2 rounded-md" style={{ backgroundColor: colors.accentLight }}>
                <Plus size={18} color="black" className="mr-1" />
                <Text className="text-black font-semibold text-sm">Add Exercise</Text>
              </View>
            </Button>

            <Button onPress={handleSubmit}>
              <Text className="text-black rounded-lg font-bold italic text-xl py-4 px-16" style={{ backgroundColor: colors.fitness.pastelYellow }}>
                Save Workout! ✅
              </Text>
            </Button>
          </View>
        }
      />
    </View>
  );
}
