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
*   - style: inline styles (e.g. background)  *
*   - onPress: function to handle press       *
*   - disabled: boolean to disable the button *
*   - loading: boolean to show spinner        *
* Output: Pressable component styled as button*
***********************************************/
export const Button = ({
  children,
  className = "",
  style = {},
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={twMerge(
        "px-4 py-2 rounded-md items-center justify-center flex",
        disabled ? "opacity-50" : "",
        className
      )}
      style={style}
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
