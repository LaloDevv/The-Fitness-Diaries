/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from 'react';
import userData from "../data/userData";
import Toast from 'react-native-toast-message';
import strings from "../constants/strings";
import { startOfWeek } from "date-fns";

// Create the user context with undefined initial value
const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(userData);

  /**********************************************
  /* Description: Add a new workout             *
  /* args: workout (object with workout data)   *
  /* Output: updates user state and shows toast *
  /**********************************************/
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

  /**********************************************
  /* Description: Update an existing workout    *
  /* args: workout (object with updated data)   *
  /* Output: updates user state and shows toast *
  /**********************************************/
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

  /**********************************************
  /* Description: Delete a workout by its ID    *
  /* args: workoutId (string)                   *
  /* Output: updates user state and shows toast *
  /**********************************************/
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

  /***********************************************************
  * Description: Adds a workout session and updates weeks    *
  * args:                                                    *
  *   - session: { exercises: [...] }                        *
  * Output: updates user.weeks, workoutSessions, and toast   *
  ***********************************************************/
  const addWorkoutSession = (session) => {
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // Normalize today to the Monday of the week
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const mondayISO = monday.toISOString().split("T")[0];

    // Check if this week's Monday already exists
    const alreadyExists = user.weeks.includes(mondayISO);

    const updatedWeeks = alreadyExists
      ? [...user.weeks]
      : [...user.weeks, mondayISO];

    const newWeekNumber = updatedWeeks.length;

    const newSession = {
      ...session,
      id: `session${user.workoutSessions.length + 1}`,
      date: todayISO,
      weekNumber: newWeekNumber,
    };

    setUser((prevUser) => ({
      ...prevUser,
      weeks: updatedWeeks,
      workoutSessions: [...prevUser.workoutSessions, newSession],
    }));
  };

  /***********************************************************
  /* Description: Update an existing workout session         *
  /* args: session (object with updated session data)        *
  /* Output: updates user state and shows toast              *
  /***********************************************************/
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

  /*************************************************************
* Description: Add or update weight entry for current week  *
* args: entry (object with { weight })                      *
* Output: updates user.weightEntries and user.weeks         *
*************************************************************/
const addWeightEntry = (entry) => {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const mondayISO = monday.toISOString().split("T")[0];

  // Actualizar weeks si no existe la semana
  const alreadyExists = user.weeks.includes(mondayISO);
  const updatedWeeks = alreadyExists
    ? [...user.weeks]
    : [...user.weeks, mondayISO];

  const weekNumber = updatedWeeks.indexOf(mondayISO) + 1;

  const weekExists = user.weightEntries.some(w => w.week === weekNumber);

  if (weekExists) {
    setUser(prevUser => ({
      ...prevUser,
      weeks: updatedWeeks,
      weightEntries: prevUser.weightEntries.map(w =>
        w.week === weekNumber
          ? { ...w, weight: entry.weight, date: todayISO }
          : w
      ),
    }));

    Toast.show({
      type: 'success',
      text1: strings.successUpdateWeight,
    });
  } else {
    const newEntry = {
      weight: entry.weight,
      date: todayISO,
      week: weekNumber,
    };

    setUser(prevUser => ({
      ...prevUser,
      weeks: updatedWeeks,
      weightEntries: [...prevUser.weightEntries, newEntry].sort((a, b) => a.week - b.week),
    }));

    Toast.show({
      type: 'success',
      text1: strings.successAddWeight,
    });
  }
};

  /**************************************************************
  /* Description: Get the next available week number            *
  /* args: none                                                 *
  /* Output: number (next week based on weight or sessions)     *
  /**************************************************************/
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

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
