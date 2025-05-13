/* eslint-disable prettier/prettier */
import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import colors from "../../constants/colors";

export default function History() {
    const { user, loading  } = useUser();
    const router = useRouter();

    // Memoized sorted array of unique week numbers
    const weekNumbers = useMemo(() => {
        const uniqueWeeks = [...new Set(user.workoutSessions.map(s => s.weekNumber))];
        return uniqueWeeks.sort((a, b) => b - a);
    }, [user.workoutSessions]);

    const renderWeek = useCallback(({ item: week }) => {
        const sessions = user.workoutSessions.filter((s) => s.weekNumber === week);
        return (
          <Pressable
            onPress={() => router.push(`/history/week/${week}`)}
            className="p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Text className="text-lg font-semibold mb-1" style={{ color: colors.fitness.pastelYellow }}>
              Week {week}
            </Text>
            <Text className="text-sm text-gray-400">
              {sessions.length} workout{sessions.length !== 1 ? "s" : ""}
            </Text>
          </Pressable>
        );
      }, [user.workoutSessions, router]);

      if (loading || !user.workoutSessions) {
        return (
          <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white">Loading history...</Text>
          </View>
        );
      }
      
    return (
        <FlatList
            className="px-4 pt-6"
            style={{ backgroundColor: colors.darkBackground }}
            data={weekNumbers}
            keyExtractor={(item) => item.toString()}
            renderItem={renderWeek}
            ListHeaderComponent={
                <View className="items-center mb-6">
                    <Text className="text-2xl font-bold" style={{ color: colors.fitness.pastelYellow }}>
                        Workout History
                    </Text>
                    <Text className="text-gray-400">Review your past workouts</Text>
                </View>
            }
            ListEmptyComponent={
                <View className="items-center py-8 rounded-lg" style={{ backgroundColor: colors.fitness.darkGray }}>
                    <Text className="text-gray-400">No workout history yet</Text>
                    <Text className="text-sm text-gray-500 mt-2">
                        Complete your first workout to see it here
                    </Text>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
        />
    );
}
