/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, Dimensions, ScrollView, Alert } from "react-native";
import { useUser } from "../../context/UserContext";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import colors from "../../constants/colors";
import strings from "../../constants/strings";
import { LineChart } from "react-native-chart-kit";
import { useMemo } from "react";

export default function Profile() {
  const { user, addWeightEntry } = useUser();
  const [weight, setWeight] = useState("");
  const MAX_VISIBLE_WEEKS = 8;


  /***********************************************************
* Description: Opens confirmation before saving weight     *
* args: none                                               *
* Output: Alert -> if confirmed, calls addWeightEntry      *
***********************************************************/
  const handleSubmit = () => {
    if (!weight) return;

    Alert.alert(
      "Confirm Weight Entry",
      "Only one weight entry is allowed per week.\nIf one already exists, it will be overwritten.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            addWeightEntry({
              weight: parseFloat(weight),
            });
            setWeight("");
          },
          style: "default",
        },
      ]
    );
  };

  // limit the visible entries to the last 8 weeks, and only re-render when the user weightEntries change
  const { weightLabels, weightData } = useMemo(() => {
    const visibleEntries = user.weightEntries.length > MAX_VISIBLE_WEEKS
      ? user.weightEntries.slice(-MAX_VISIBLE_WEEKS)
      : user.weightEntries;

    return {
      weightLabels: visibleEntries.map((entry) => `W${entry.week}`),
      weightData: visibleEntries.map((entry) => entry.weight),
    };
  }, [user.weightEntries]);


  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.darkBackground }}
    >
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
                {
                  user.weightEntries[user.weightEntries.length - 1]
                    .weight
                }{" kg"}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Gráfica de peso */}
      {user.weightEntries.length > 0 && (
        <View className="mb-6">
          <Text className="text-white font-semibold text-center mb-2">
            {strings.weightChartLabel}
          </Text>
          <LineChart
            data={{
              labels: weightLabels,
              datasets: [{ data: weightData }],
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
                r: "3",
                strokeWidth: "2",
                stroke: colors.fitness.yellow,
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
      )}

      {/* Formulario para introducir nuevo peso */}
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
            onPress={handleSubmit}
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
