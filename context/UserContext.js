/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Toast from "react-native-toast-message";
import strings from "../constants/strings";
import { startOfWeek } from "date-fns";
import { useAuth } from "./AuthContext";

const UserContext = createContext();
const DUMMY_UID = "dummyUID123";

/**
 * @function UserProvider
 * @description Provides all user data and action functions from Firestore via context.
 */
export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  const [user, setUserData] = useState({
    name: "",
    age: null,
    height: null,
    workouts: [],
    workoutSessions: [],
    weightEntries: [],
    weeks: [],
  });
  const [loading, setLoading] = useState(true);
  const uid = authUser?.uid;

  /**
   * @function fetchUserData
   * @description Loads the document fields and all subcollections from Firestore.
   */
  const fetchUserData = async () => {
    try {
      const userRef = doc(db, "users", DUMMY_UID);

      const [docSnap, workoutsSnap, sessionsSnap, weightsSnap, weeksSnap] = await Promise.all([
        getDoc(userRef),
        getDocs(collection(userRef, "workouts")),
        getDocs(collection(userRef, "workoutSessions")),
        getDocs(collection(userRef, "weightEntries")),
        getDocs(collection(userRef, "weeks")),
      ]);

      // Merge top-level user fields with subcollection data
      const generalData = docSnap.exists() ? docSnap.data() : {};
      const workouts = workoutsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const workoutSessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const weightEntries = weightsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const weeks = weeksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUserData({
        ...generalData,
        workouts,
        workoutSessions,
        weightEntries,
        weeks,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  /**
   * @function addWorkout
   * @description Adds a new workout to Firestore and refreshes state.
   */
  const addWorkout = async (workout) => {
    const userRef = doc(db, "users", DUMMY_UID);
    const workoutRef = doc(collection(userRef, "workouts"));

    // Assign the document ID inside the object
    const workoutWithId = {
    ...workout,
    id: workoutRef.id,
  };

    await setDoc(workoutRef, workoutWithId);
    await fetchUserData();
    Toast.show({ type: "success", text1: strings.successAddWorkout });
  };

  /**
   * @function updateWorkout
   * @description Updates an existing workout in Firestore.
   */
  const updateWorkout = async (workout) => {
    const userRef = doc(db, "users", DUMMY_UID);
    const workoutRef = doc(userRef, "workouts", workout.id);
    await updateDoc(workoutRef, workout);
    await fetchUserData();
    Toast.show({ type: "success", text1: strings.successUpdateWorkout });
  };

  /**
   * @function deleteWorkout
   * @description Deletes a workout by ID from Firestore.
   */
  const deleteWorkout = async (workoutId) => {
    const userRef = doc(db, "users", DUMMY_UID);
    const workoutRef = doc(userRef, "workouts", workoutId);
    await deleteDoc(workoutRef);
    await fetchUserData();
    Toast.show({ type: "success", text1: strings.successDeleteWorkout });
  };

  /**
   * @function addWorkoutSession
   * @description Adds a new workout session and ensures the week exists.
   */
  const addWorkoutSession = async (session) => {
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // Calculate current week's Monday
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const mondayISO = monday.toISOString().split("T")[0];

    const userRef = doc(db, "users", DUMMY_UID);
    const weeksRef = collection(userRef, "weeks");

    // Add week if not already present
    const exists = user.weeks.some((w) => w.date === mondayISO);
    if (!exists) {
      const newWeekRef = doc(weeksRef);
      await setDoc(newWeekRef, { date: mondayISO });
    }

    // Recalculate week number from ordered weeks
    const updatedWeeksSnap = await getDocs(weeksRef);
    const updatedWeeks = updatedWeeksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const newWeekNumber = updatedWeeks.findIndex(w => w.date === mondayISO) + 1;

    const newSession = {
      ...session,
      date: todayISO,
      weekNumber: newWeekNumber,
    };

    const sessionRef = doc(collection(userRef, "workoutSessions"));
    await setDoc(sessionRef, newSession);
    await fetchUserData();
  };

  /**
   * @function updateWorkoutSession
   * @description Updates a workout session in Firestore.
   */
  const updateWorkoutSession = async (session) => {
    const userRef = doc(db, "users", DUMMY_UID);
    const sessionRef = doc(userRef, "workoutSessions", session.id);
    await updateDoc(sessionRef, session);
    await fetchUserData();
  };

  /**
   * @function getCurrentWeekNumber
   * @description Returns the next available week number based on entries.
   */
  const getCurrentWeekNumber = () => {
    const { weightEntries, workoutSessions } = user;

    if (weightEntries.length > 0) {
      const latestWeek = Math.max(...weightEntries.map(w => w.week));
      return latestWeek + 1;
    }

    if (workoutSessions.length > 0) {
      const latestWeek = Math.max(...workoutSessions.map(s => s.weekNumber));
      return latestWeek + 1;
    }

    return 1;
  };

  /**
   * @function addWeightEntry
   * @description Adds or updates a weight entry for the current week.
   */
  const addWeightEntry = async (entry) => {
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const mondayISO = monday.toISOString().split("T")[0];

    const userRef = doc(db, "users", DUMMY_UID);
    const weeksRef = collection(userRef, "weeks");
    const weightsRef = collection(userRef, "weightEntries");

    // Add the week if missing
    const exists = user.weeks.some((w) => w.date === mondayISO);
    if (!exists) {
      const newWeekRef = doc(weeksRef);
      await setDoc(newWeekRef, { date: mondayISO });
    }

    // Recalculate correct week number
    const weeksSnap = await getDocs(weeksRef);
    const weeks = weeksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sortedWeeks = [...weeks].sort((a, b) => new Date(a.date) - new Date(b.date));
    const weekNumber = sortedWeeks.findIndex(w => w.date === mondayISO) + 1;

    // Check for existing entry for that week
    const existing = user.weightEntries.find(w => w.week === weekNumber);

    if (existing) {
      const entryRef = doc(weightsRef, existing.id);
      await updateDoc(entryRef, { weight: entry.weight, date: todayISO });
      Toast.show({ type: "success", text1: strings.successUpdateWeight });
    } else {
      const newEntry = {
        weight: entry.weight,
        date: todayISO,
        week: weekNumber,
      };
      const newRef = doc(weightsRef);
      await setDoc(newRef, newEntry);
      Toast.show({ type: "success", text1: strings.successAddWeight });
    }

    await fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
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

/**
 * @function useUser
 * @description Custom hook to access user context data and functions.
 */
export const useUser = () => useContext(UserContext);
