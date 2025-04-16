/* eslint-disable prettier/prettier */
import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../../../context/UserContext";
import { ArrowLeft } from "lucide-react-native";
import { format } from "date-fns";
import colors from "../../../constants/colors";

export default function SessionHistory() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const session = user.workoutSessions.find((s) => s.id === sessionId);

  const workoutName = useMemo(() => {
    const firstExerciseId = session?.exercises?.[0]?.exerciseId;
    const workout = user.workouts.find((w) =>
      w.exercises.some((e) => e.id === firstExerciseId)
    );
    return workout?.name ?? `Session ${sessionId}`;
  }, [user.workouts, session, sessionId]);

  const { stats, totalVolume, totalReps, totalSets } = useMemo(() => {
    const result = session.exercises.map((exercise) => {
      // Only include sets where weight and reps > 0
      const validSets = exercise.sets.filter(
        (set) => set.weight > 0 && set.reps > 0
      );

      const volume = validSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      const reps = validSets.reduce((sum, s) => sum + s.reps, 0);

      return { ...exercise, sets: validSets, volume, reps };
    });

    const totalVolume = result.reduce((sum, ex) => sum + ex.volume, 0);
    const totalReps = result.reduce((sum, ex) => sum + ex.reps, 0);
    const totalSets = result.reduce((sum, ex) => sum + ex.sets.length, 0);

    return { stats: result, totalVolume, totalReps, totalSets };
  }, [session]);

  const renderExercise = ({ item }) => (
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

      {item.sets.map((set, i) => (
        <View key={set.id || i} className="flex-row justify-between mb-1">
          <Text className="text-white">Set {i + 1}</Text>
          <Text className="text-white">
            {set.weight} kg x {set.reps} reps
          </Text>
        </View>
      ))}

      <View className="mt-2 border-t border-gray-600 pt-2">
        <View className="flex flex-row justify-around">
          <Text className="text-white text-sm font-semibold italic">
            Total Volume:
          </Text>
          <Text className="text-white text-sm">{item.volume} kg</Text>
        </View>
        <View className="flex flex-row justify-around">
          <Text className="text-white text-sm font-semibold italic">
            Total Reps:
          </Text>
          <Text className="text-white text-sm">{item.reps}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-4 pt-4" style={{ backgroundColor: colors.darkBackground }}>
      <View className="flex-row items-center mb-6 mt-4">
        <Pressable onPress={() => router.back()} className="mr-2">
          <ArrowLeft size={24} color="white" />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-white">{workoutName}</Text>
          <Text className="text-sm text-gray-400 italic">
            {format(new Date(session.date), "dd MMM yyyy")}
          </Text>
        </View>
      </View>

      <FlatList
        data={stats}
        keyExtractor={(item) => item.exerciseId}
        renderItem={renderExercise}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          <View className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
            <Text
              className="text-lg font-semibold text-white mb-2"
              style={{ color: colors.fitness.pastelYellow }}
            >
              Session Stats
            </Text>
            <View className="flex flex-row justify-around">
              <Text className="text-white text-sm font-semibold italic">
                Total Volume:
              </Text>
              <Text className="text-white text-sm">{totalVolume} kg</Text>
            </View>
            <View className="flex flex-row justify-around">
              <Text className="text-white text-sm font-semibold italic">
                Total Reps:
              </Text>
              <Text className="text-white text-sm">{totalReps}</Text>
            </View>
            <View className="flex flex-row justify-around">
              <Text className="text-white text-sm font-semibold italic">
                Total Sets:
              </Text>
              <Text className="text-white text-sm">{totalSets}</Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
