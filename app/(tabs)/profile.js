/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useUser } from "../../context/UserContext";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import Toast from "react-native-toast-message";
import colors from "../../constants/colors";
import strings from "../../constants/strings";
import { LineChart } from "react-native-chart-kit";
import { ArrowRight } from "lucide-react-native";


export default function Profile() {
  const { user, addWeightEntry, loading } = useUser();
  const [weight, setWeight] = useState("");
  const MAX_VISIBLE_WEEKS = 8;

  /***********************************************************
  * Description: Confirms before submitting a weight entry  *
  ***********************************************************/
  const handleSubmitConfirm = () => {
    if (!weight) return;

    Toast.show({
      type: "info",
      text1: "Reminder",
      text2: "Only one weight per week is stored. If it exists, it will be updated.",
    });

    addWeightEntry({
      weight: parseFloat(weight),
    });

    setWeight("");
  };

  /***********************************************************
  * Description: Memoized chart data for weight and volume  *
  ***********************************************************/
  const chartData = useMemo(() => {
    const visibleWeights = user.weightEntries.slice(-MAX_VISIBLE_WEEKS);
    const weightLabels = visibleWeights.map((entry) => `W${entry.week}`);
    const weightData = visibleWeights.map((entry) => entry.weight);

    const volumesByWeek = {};
    user.workoutSessions.forEach((session) => {
      const validVolume = session.exercises.flatMap((ex) =>
        ex.sets.filter((s) => s.reps > 0 && s.weight > 0)
      ).reduce((sum, s) => sum + s.weight * s.reps, 0);

      if (volumesByWeek[session.weekNumber]) {
        volumesByWeek[session.weekNumber] += validVolume;
      } else {
        volumesByWeek[session.weekNumber] = validVolume;
      }
    });

    const sortedWeeks = Object.keys(volumesByWeek)
      .sort((a, b) => a - b)
      .slice(-MAX_VISIBLE_WEEKS);

    const volumeLabels = sortedWeeks.map((w) => `W${w}`);
    const volumeData = sortedWeeks.map((w) => volumesByWeek[w]);

    return {
      weight: { labels: weightLabels, data: weightData },
      volume: { labels: volumeLabels, data: volumeData },
    };
  }, [user.weightEntries, user.workoutSessions]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.darkBackground }}
    >
      {/* User Info */}
      <View className="flex flex-row mb-8 mt-4 p-4 rounded-lg items-center justify-around"
        style={{ backgroundColor: colors.cardBackground }}>
        <View className="flex flex-col">
          <View className="flex flex-row">
            <Text className="text-white italic font-semibold text-center text-lg mb-2"
              style={{ color: colors.fitness.pastelYellow }}>
              {strings.nameLabel}:{" "}
            </Text>
            <Text className="text-white text-center text-lg">
              {user.name}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-white italic font-semibold text-center text-lg"
              style={{ color: colors.fitness.pastelYellow }}>
              {strings.ageLabel}:{" "}
            </Text>
            <Text className="text-white text-center text-lg">
              {user.age}
            </Text>
          </View>
        </View>
        <View className="flex flex-col">
          <View className="flex flex-row">
            <Text className="text-white italic font-semibold text-center text-lg mb-2"
              style={{ color: colors.fitness.pastelYellow }}>
              {strings.heightLabel}:{" "}
            </Text>
            <Text className="text-white text-center text-lg">
              {user.height} cm
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-white italic font-semibold text-center text-lg"
              style={{ color: colors.fitness.pastelYellow }}>
              {strings.latestWeightLabel}:{" "}
            </Text>
            {user.weightEntries.length > 0 && (
              <Text className="text-white text-center text-lg">
                {user.weightEntries[user.weightEntries.length - 1].weight}{" kg"}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Charts */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="mb-2"
      >
        {/* Weight Chart */}
        <View style={{ width: Dimensions.get("window").width - 32 }}>
          <Text className="text-white text-center font-semibold mb-2">
            Weight Progress
          </Text>
          <LineChart
            data={{
              labels: chartData.weight.labels,
              datasets: [{ data: chartData.weight.data }],
            }}
            width={Dimensions.get("window").width - 32}
            height={220}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: colors.darkBackground,
              backgroundGradientFrom: colors.darkBackground,
              backgroundGradientTo: colors.darkBackground,
              decimalPlaces: 1,
              color: () => colors.fitness.pastelYellow,
              labelColor: () => "#d1d5db",
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colors.fitness.yellow,
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Volume Chart */}
        <View style={{ width: Dimensions.get("window").width - 32 }}>
          <Text className="text-white text-center font-semibold mb-2">
            Volume Progress
          </Text>
          <LineChart
            data={{
              labels: chartData.volume.labels,
              datasets: [{ data: chartData.volume.data }],
            }}
            width={Dimensions.get("window").width - 32}
            height={220}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: colors.darkBackground,
              backgroundGradientFrom: colors.darkBackground,
              backgroundGradientTo: colors.darkBackground,
              decimalPlaces: 0,
              color: () => colors.fitness.pastelYellow,
              labelColor: () => "#d1d5db",
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colors.fitness.yellow,
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
      </ScrollView>

      <View className="flex-row justify-center items-center mb-2">
        <Text className="text-white text-base mr-1 italic font-bold">Scroll to see more</Text>
        <ArrowRight size={20} color="white" />
      </View>


      {/* Weight Input */}
      <View className="mb-6">
        <Label>{strings.newWeightLabel}</Label>
        <Input
          keyboardType="numeric"
          placeholder="Enter your weight (kg)"
          value={weight}
          onChangeText={setWeight}
          className="border-white mb-3 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200"
        />
        <View className="items-center rounded-md mb-10">
          <Button
            onPress={handleSubmitConfirm}
            className="flex flex-row items-center"
            style={{ backgroundColor: colors.fitness.pastelYellow }}
          >
            <Text className="text-black font-semibold text-sm">
              {strings.submitWeightButton}
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
