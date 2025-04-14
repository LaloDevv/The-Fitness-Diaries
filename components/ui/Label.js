/* eslint-disable prettier/prettier */
import React from "react";
import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

/***********************************************************
* Description: Reusable label for input fields             *
* args:                                                    *
*   - className: optional Tailwind classes                 *
*   - children: label content                              *
* Output: Styled Text component acting as label            *
***********************************************************/
export const Label = ({ className = "", children, ...props }) => {
  return (
    <Text
      className={twMerge("text-sm font-medium leading-none text-white mb-1", className)}
      {...props}
    >
      {children}
    </Text>
  );
};
