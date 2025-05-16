/* eslint-disable prettier/prettier */
import React, { useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../../../context/UserContext";
import { Calendar, ArrowLeft } from "lucide-react-native";
import colors from "../../../constants/colors";
import { format } from "date-fns";

export default function WeekHistory() {
    const { weekNumber } = useLocalSearchParams();
    const router = useRouter();
    const { user, loading } = useUser();

    const week = parseInt(weekNumber);

    const sessionsWithWorkout = useMemo(() => {
        return user.workoutSessions
            // Filter sessions to only include those from the current week
            .filter((session) => session.weekNumber === week)
            .map((session) => {
                // Get the first exercise ID from the session as a reference
                const firstExerciseId = session.exercises?.[0]?.exerciseId;

                // Try to find the original workout that includes this exercise
                const workout = user.workouts.find((w) =>
                    w.exercises.some((e) => e.id === firstExerciseId)
                );

                // Return the session with an added 'workoutName' field
                return {
                    ...session,
                    workoutName: workout?.name ?? "Unknown Workout",
                };
            });
    }, [user.workoutSessions, user.workouts, week]);


    const weightEntry = user.weightEntries.find(
        (entry) => entry.week === week
    );

    const renderSession = ({ item }) => (
        <Pressable
            onPress={() => router.push(`/history/session/${item.id}`)}
            className="p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.cardBackground }}
        >
            <Text className="text-base text-white mb-1">
                <Text className="italic font-bold" style={{ color: colors.fitness.pastelYellow }}>
                    {item.workoutName}
                </Text>
                {" - "}
                {format(new Date(item.date), "dd MMM yyyy")}
            </Text>
            <Text className="text-sm text-gray-400">
                {item.exercises.length}{" exercise"}{item.exercises.length !== 1 && "s"}
            </Text>
        </Pressable>
    );



    if (loading || !user.workoutSessions.length) {
        return (
            <View className="flex-1 flex-col items-center justify-center bg-black">
                <Text className="text-white mb-4">Loading workouts...</Text>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View className="flex-1 px-4 pt-4" style={{ backgroundColor: colors.darkBackground }}>
            <View className="flex-row items-center mb-6 mt-4">
                <Pressable onPress={() => router.back()} className="mr-2">
                    <ArrowLeft size={24} color="white" />
                </Pressable>
                <Text className="text-2xl font-bold text-white">
                    {"Week "} {week}
                </Text>
            </View>

            {weightEntry && (
                <View
                    className="flex-row items-center justify-between px-4 py-3 rounded-lg mb-4"
                    style={{ backgroundColor: colors.cardBackground }}
                >
                    <View className="flex-row items-center">
                        <Calendar size={20} color={colors.fitness.pastelYellow} />
                        <Text className="ml-2 text-white text-base font-medium">
                            {format(new Date(weightEntry.date), "dd MMM yyyy")}
                        </Text>
                    </View>
                    <Text className="text-white text-lg font-bold">
                        {`Weight: ${weightEntry.weight} kg`}
                    </Text>

                </View>
            )}

            <FlatList
                data={sessionsWithWorkout}
                keyExtractor={(item) => item.id}
                renderItem={renderSession}
                ListHeaderComponent={
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-white mb-2">
                            Sessions
                        </Text>
                        <Text className="text-gray-400">
                            {`${sessionsWithWorkout.length} session${sessionsWithWorkout.length !== 1 ? "s" : ""} this week`}
                        </Text>

                    </View>
                }
                ListEmptyComponent={
                    <Text className="text-gray-400 text-center mt-4">
                        No sessions found for this week
                    </Text>
                }
            />
        </View>
    );
}
