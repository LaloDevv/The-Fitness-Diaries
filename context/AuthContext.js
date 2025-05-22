/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";


// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Check for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                console.log("Auth state CHANGE en AuthContext: " + user.email + " " + user.uid);
            }
            setUser(user);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in function
    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };


    const register = async (email, password, { name, age, height }) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
      
        const userRef = doc(db, "users", uid);
      
        await setDoc(userRef, {
          name,
          age,
          height,
        });
      
        console.log("✅ Usuario creado en Auth y Firestore:", uid);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
