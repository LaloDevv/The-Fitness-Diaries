/* eslint-disable prettier/prettier */
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DUMMY_UID = "dummyUID123";

export const fixWorkoutIds = async () => {
  try {
    const userRef = doc(db, "users", DUMMY_UID);
    const workoutsRef = collection(userRef, "workouts");

    const snapshot = await getDocs(workoutsRef);
    const updates = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;

      // Si el campo `id` no coincide con el ID real del documento, lo actualizamos
      if (data.id !== docId) {
        const workoutRef = doc(workoutsRef, docId);
        updates.push(updateDoc(workoutRef, { id: docId }));
        console.log(`✅ Updated workout: ${docId}`);
      }
    }

    await Promise.all(updates);
    console.log("🎉 Todos los workouts están corregidos.");
  } catch (error) {
    console.error("❌ Error corrigiendo workouts:", error);
  }
};
