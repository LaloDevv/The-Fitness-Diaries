/* eslint-disable prettier/prettier */
import React from "react";
import { TextInput } from "react-native";
import { twMerge } from "tailwind-merge";


/***********************************************************
* Description: Reusable input component for text fields    *
* args:                                                    *
*   - className: optional Tailwind classes                 *
*   - ...props: TextInput props                            *
* Output: TextInput component with merged styling          *
***********************************************************/
export const Input = ({ className = "", ...props }) => {
  return (
    <TextInput
      className={twMerge(
        "h-10 w-full rounded-md border px-3 py-2 text-base text-white",
        "placeholder:text-gray-400",
        "focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200",
        "disabled:opacity-50",
        className
      )}
      placeholderTextColor="#94a3b8"
      {...props}
    />
  );
};
