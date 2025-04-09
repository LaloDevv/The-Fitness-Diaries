/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
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
  const { user } = useUser();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 px-4 pt-6"
    style={{ backgroundColor: colors.fitness.darkBackground }}>
      <View className="mb-8 items-center">
        <Text className="text-2xl font-bold text-fitness-pastelYellow">
          {strings.welcomeMessage}{user.name}!
        </Text>
        <Text className="text-gray-400 text-center">
          {strings.introText}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-center text-lg font-semibold text-white mb-4">
          {strings.workoutsTitle}
        </Text>

        {user.workouts.length === 0 ? (
          <View className="items-center py-8 bg-fitness-darkGray/50 rounded-lg">
            <Text className="text-gray-300 mb-4">
              You don't have any workouts yet
            </Text>
            <Button
              onPress={() => router.push("/add-workout")}
              className="bg-fitness-yellow px-4 py-2 rounded-md"
            >
              <Text className="text-black font-semibold text-sm">
                Create Your First Workout
              </Text>
            </Button>
          </View>
        ) : (
          <View className="space-y-3">
            {user.workouts.map((workout) => (
              <Pressable
                key={workout.id}
                onPress={() => router.push(`/start-workout/${workout.id}`)}
                className="p-4 rounded-lg bg-fitness-darkGray"
              >
                <Text className="text-lg font-semibold text-fitness-pastelYellow mb-2">
                  {workout.name}
                </Text>
                <Text className="text-sm text-gray-400">
                  {workout.exercises.length} exercises
                </Text>
                <View className="mt-2 flex flex-row flex-wrap gap-1 justify-center">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <Text
                      key={exercise.id}
                      className="text-xs bg-fitness-darkGray/70 px-2 py-1 rounded text-white"
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
            ))}

            <View className="py-4 items-center">
              <Button
                onPress={() => router.push("/add-workout")}
                className="bg-fitness-yellow px-4 py-2 rounded-md flex flex-row items-center"
              >
                <Plus size={20} className="mr-1 text-black" />
                <Text className="text-black font-semibold text-sm">
                  Add Workout
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
