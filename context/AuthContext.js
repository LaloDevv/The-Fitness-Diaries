/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
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


    // Register new user
    const register = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
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
