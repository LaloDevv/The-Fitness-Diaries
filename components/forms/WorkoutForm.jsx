/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Trash2, Plus } from "lucide-react-native";
import Toast from "react-native-toast-message";
import colors from "../../constants/colors";
import { twMerge } from "tailwind-merge";
import { router } from "expo-router";

/***********************************************************
* Description: Reusable Workout Form                       *
* args:                                                    *
*   - initialWorkout: { name, exercises } or null          *
*   - onSubmit: function to handle workout data            *
*   - mode: "add" | "edit" (for UI adjustments)            *
* Output: Form UI for creating or editing a workout        *
***********************************************************/
export default function WorkoutForm({ initialWorkout = null, onSubmit, mode = "add" }) {
  const [name, setName] = useState(initialWorkout?.name || "");
  const [exercises, setExercises] = useState(
    initialWorkout?.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.toString(),
      reps: ex.reps.toString(),
    })) || [{ name: "", sets: "3", reps: "10" }]
  );
  const [inputErrors, setInputErrors] = useState({});

  /***********************************************************
  * Description: Sync form when initialWorkout changes       *
  * args: none                                               *
  * Output: Updates local state with props                   *
  ***********************************************************/
  useEffect(() => {
    setName(initialWorkout?.name || "");
    setExercises(
      initialWorkout?.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.toString(),
        reps: ex.reps.toString(),
      })) || [{ name: "", sets: "3", reps: "10" }]
    );
  }, [initialWorkout]);

  /***********************************************************
  * Description: Add empty exercise to the form              *
  * args: none                                               *
  * Output: Pushes default object to exercises state         *
  ***********************************************************/
  const handleAddExercise = () => {
    setExercises((prev) => [...prev, { name: "", sets: "3", reps: "10" }]);
  };

  /***********************************************************
  * Description: Remove exercise by index                    *
  * args: index (number)                                     *
  * Output: Filters exercises state to remove item           *
  ***********************************************************/
  const handleRemoveExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  /***********************************************************
  * Description: Update field in exercise and validate       *
  * args:                                                    *
  *   - index: number                                        *
  *   - field: string ('name' | 'sets' | 'reps')             *
  *   - value: string                                        *
  * Output: Updates exercises and manages inputErrors        *
  ***********************************************************/
  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    const isNumberField = field === "sets" || field === "reps";
    updated[index][field] = value;

    if (isNumberField) {
      const isNegative = parseFloat(value) < 0;
      const errorKey = `${index}-${field}`;
      setInputErrors((prev) => ({
        ...prev,
        [errorKey]: isNegative ? `${field} must be 0 or higher` : undefined,
      }));
    }

    setExercises(updated);
  };

  /***********************************************************
  * Description: Validate form and call onSubmit             *
  * args: none                                               *
  * Output: Calls onSubmit with formatted workout object     *
  ***********************************************************/
  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Workout name is required" });
      return;
    }

    const hasErrors = Object.values(inputErrors).some(Boolean);
    if (hasErrors) {
      Toast.show({ type: "error", text1: "Fix input errors before saving" });
      return;
    }

    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) {
      Toast.show({ type: "error", text1: "At least one exercise is required" });
      return;
    }

    const preparedExercises = validExercises.map((e) => ({
      ...e,
      sets: Math.max(0, parseInt(e.sets) || 0),
      reps: Math.max(0, parseInt(e.reps) || 0),
    }));

    onSubmit({ name, exercises: preparedExercises });

    Toast.show({
      type: "success",
      text1: mode === "edit" ? "Workout updated!" : "Workout added!",
    });
    router.back();
  };

  /***********************************************************
  * Description: Renders one exercise form card              *
  * args: item, index                                        *
  * Output: Exercise inputs with validation and delete button*
  ***********************************************************/
  const renderExercise = ({ item, index }) => (
    <View key={index} className="mb-2 p-4 rounded-lg border" style={{
      borderColor: colors.fitness.pastelYellow,
      backgroundColor: colors.cardBackground,
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
            value={item.sets}
            onChangeText={(val) => handleChange(index, "sets", val)}
            className={twMerge(
              "border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200",
              inputErrors[`${index}-sets`] ? "border-red-500" : ""
            )}
          />
          {inputErrors[`${index}-sets`] && (
            <Text className="text-red-500 text-xs mt-1">
              {inputErrors[`${index}-sets`]}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Label>Reps</Label>
          <Input
            keyboardType="numeric"
            value={item.reps}
            onChangeText={(val) => handleChange(index, "reps", val)}
            className={twMerge(
              "border-white focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200",
              inputErrors[`${index}-reps`] ? "border-red-500" : ""
            )}
          />
          {inputErrors[`${index}-reps`] && (
            <Text className="text-red-500 text-xs mt-1">
              {inputErrors[`${index}-reps`]}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
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

            <Button onPress={handleSave}>
              <Text className="text-black rounded-lg font-bold italic text-xl py-4 px-16"
                style={{ backgroundColor: colors.fitness.pastelYellow }}>
                {mode === "edit" ? "Save Changes" : "Save Workout! ✅"}
              </Text>
            </Button>
          </View>
        }
      />
    </View>
  );
}
