/* eslint-disable prettier/prettier */
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import userData from "../data/userData";

const DUMMY_UID = "dummyUID123";
const uid = "1YQsIDv0N7bEQ40L2Q38WLqG23M2";

export const uploadUserData = async () => {
  try {
    const userRef = doc(db, "users", uid);

    // ✅ Subir datos generales (name, age, height)
    await setDoc(userRef, {
      name: userData.name,
      age: userData.age,
      height: userData.height,
    });

    // 🔁 Subir workouts (id = Firestore doc ID)
    for (const workout of userData.workouts) {
      const ref = doc(collection(userRef, "workouts"));
      await setDoc(ref, { ...workout, id: ref.id });
    }

    // 🔁 Subir weightEntries (id = Firestore doc ID)
    for (const entry of userData.weightEntries) {
      const ref = doc(collection(userRef, "weightEntries"));
      await setDoc(ref, { ...entry, id: ref.id });
    }

    // 🔁 Subir weeks (id = Firestore doc ID)
    for (const week of userData.weeks) {
      const ref = doc(collection(userRef, "weeks"));
      await setDoc(ref, { ...week, id: ref.id });
    }

    // 🔁 Subir workoutSessions (si existen)
    if (userData.workoutSessions) {
      for (const session of userData.workoutSessions) {
        const ref = doc(collection(userRef, "workoutSessions"));
        await setDoc(ref, { ...session, id: ref.id });
      }
    }

    console.log("✅ Datos subidos correctamente con IDs coherentes.");
  } catch (error) {
    console.error("❌ Error al subir datos:", error);
  }
};
