/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUid(user ? user.uid : null);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sign in function
    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Sign out function
    const logout = async () => {
        await signOut(auth);
    };

    // Register new user
    const register = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };


    return (
        <AuthContext.Provider value={{ uid, login, logout, register, loading }}>
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
