/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from 'react';
import userData from "../data/userData";
import Toast from 'react-native-toast-message';
import strings from "../constants/strings";

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

  /********************************************************
  /* Description: Add a new workout session                *
  /* args: session (object with session data)              *
  /* Output: updates user state and shows toast            *
  /********************************************************/
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
  /* Description: Add or update a weight entry for a given week*
  /* args: entry (object with week and weight)                 *
  /* Output: updates user state and shows toast                *
  /*************************************************************/
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
