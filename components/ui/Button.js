/* eslint-disable prettier/prettier */
import React from "react";
import { Text, Pressable, ActivityIndicator } from "react-native";
import { twMerge } from "tailwind-merge";

/***********************************************
* Description: Reusable button component.     *
* Accepts className and children props.       *
* args:                                       *
*   - children: JSX.Element or string         *
*   - className: optional Tailwind classes    *
*   - onPress: function to handle press       *
*   - disabled: boolean to disable the button *
*   - loading: boolean to show spinner        *
* Output: Pressable component styled as button*
***********************************************/
// twMerge is a function that merges tailwind classes and avoids conflicts.
export const Button = ({
  children,
  className = "",
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={twMerge(
        "px-4 py-2 rounded-md bg-fitness-yellow text-black font-semibold text-sm items-center justify-center flex",
        disabled ? "opacity-50" : "",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : typeof children === "string" ? (
        <Text className="text-sm font-semibold text-black">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
