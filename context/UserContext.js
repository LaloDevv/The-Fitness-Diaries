/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from 'react';
import userData from "../data/userData";
import Toast from 'react-native-toast-message';
import strings from "../constants/strings";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(userData);

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: `workout${user.workouts.length + 1}`,
    };

    setUser(prevUser => ({
      ...prevUser,
      workouts: [...prevUser.workouts, newWorkout],
    }));

    Toast.show({
      type: 'success',
      text1: strings.successAddWorkout,
    });
  };

  const updateWorkout = (workout) => {
    setUser(prevUser => ({
      ...prevUser,
      workouts: prevUser.workouts.map(w => w.id === workout.id ? workout : w),
    }));

    Toast.show({
      type: 'success',
      text1: strings.successUpdateWorkout,
    });
  };

  const deleteWorkout = (workoutId) => {
    setUser(prevUser => ({
      ...prevUser,
      workouts: prevUser.workouts.filter(w => w.id !== workoutId),
    }));

    Toast.show({
      type: 'success',
      text1: strings.successDeleteWorkout,
    });
  };

  const addWorkoutSession = (session) => {
    const newSession = {
      ...session,
      id: `session${user.workoutSessions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };

    setUser(prevUser => ({
      ...prevUser,
      workoutSessions: [...prevUser.workoutSessions, newSession],
    }));

    Toast.show({
      type: 'success',
      text1: strings.successAddSession,
    });
  };

  const updateWorkoutSession = (session) => {
    setUser(prevUser => ({
      ...prevUser,
      workoutSessions: prevUser.workoutSessions.map(s =>
        s.id === session.id ? session : s
      ),
    }));

    Toast.show({
      type: 'success',
      text1: strings.successUpdateSession,
    });
  };

  const addWeightEntry = (entry) => {
    const weekExists = user.weightEntries.some(w => w.week === entry.week);

    if (weekExists) {
      setUser(prevUser => ({
        ...prevUser,
        weightEntries: prevUser.weightEntries.map(w =>
          w.week === entry.week
            ? { ...w, weight: entry.weight, date: new Date().toISOString().split('T')[0] }
            : w
        ),
      }));

      Toast.show({
        type: 'success',
        text1: strings.successUpdateWeight,
      });
    } else {
      const newEntry = {
        ...entry,
        date: new Date().toISOString().split('T')[0],
      };

      setUser(prevUser => ({
        ...prevUser,
        weightEntries: [...prevUser.weightEntries, newEntry].sort((a, b) => a.week - b.week),
      }));

      Toast.show({
        type: 'success',
        text1: strings.successAddWeight,
      });
    }
  };

  const getCurrentWeekNumber = () => {
    if (user.weightEntries.length > 0) {
      const latestWeek = Math.max(...user.weightEntries.map(w => w.week));
      return latestWeek + 1;
    }

    if (user.workoutSessions.length > 0) {
      const latestWeek = Math.max(...user.workoutSessions.map(s => s.weekNumber));
      return latestWeek + 1;
    }

    return 1;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addWorkoutSession,
        updateWorkoutSession,
        addWeightEntry,
        getCurrentWeekNumber,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
