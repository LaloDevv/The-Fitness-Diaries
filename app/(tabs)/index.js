/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/Button";
import strings from "../../constants/strings";
import colors from "../../constants/colors";

/***********************************************************
* Description: Home screen. Shows greeting and workouts.   *
* args: none                                               *
* Output: main tab screen with user info and actions       *
***********************************************************/
export default function Home() {
  const { user, deleteWorkout } = useUser();
  const router = useRouter();

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteWorkout(id),
        },
      ]
    );
  };

  const renderWorkout = ({ item: workout }) => (
    <Pressable
      key={workout.id}
      onPress={() => router.push(`/start-workout/${workout.id}`)}
      className="p-4 rounded-lg mb-3"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold mb-2" style={{ color: colors.fitness.pastelYellow }}>
          {workout.name}
        </Text>
        <Pressable onPress={() => confirmDelete(workout.id)}>
          <Trash2 size={18} color="#f87171" />
        </Pressable>
      </View>

      <Text className="text-sm text-gray-400 mb-2">
        {workout.exercises.length} exercises
      </Text>

      <View className="mt-2 flex flex-row flex-wrap gap-1 justify-start">
        {workout.exercises.slice(0, 3).map((exercise, index) => (
          <Text
            key={`${workout.id}-${exercise.id || index}`}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.gray }}
          >
            {exercise.name}
          </Text>
        ))}
        {workout.exercises.length > 3 && (
          <Text className="text-xs bg-fitness-darkGray/70 px-2 py-1 rounded text-white">
            +{workout.exercises.length - 3} more
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <FlatList
      className="px-4 pt-6"
      style={{ backgroundColor: colors.darkBackground }}
      data={user.workouts}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View className="items-center">
          <Text className="text-2xl italic font-bold" style={{ color: colors.fitness.pastelYellow }}>
            {strings.welcomeMessage}{user.name}!
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            {strings.introText}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center py-8 rounded-lg">
          <Text className="text-gray-300 mb-4 font-extrabold text-lg">
            You don't have any workouts yet
          </Text>
        </View>
      }
      renderItem={renderWorkout}
      ListFooterComponent={
        <View className="items-center rounded-md mb-10">
          <Button
            onPress={() => router.push("/add-workout")}
            className="flex flex-row items-center"
            style={{ backgroundColor: colors.fitness.pastelYellow }}
          >
            <Plus size={20} className="mr-1 text-black" />
            <Text className="text-black font-semibold text-sm">
              Add Workout
            </Text>
          </Button>
        </View>
      }
            
    />
  );
}
