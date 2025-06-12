"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import { colors } from "@/components/common/input/styles";

export interface CustomInputProps extends Omit<TextFieldProps, "variant"> {
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  variant?: "outlined" | "standard";
}

const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      inputClassName,
      fullWidth = false,
      variant = "outlined",
      ...props
    },
    ref,
  ) => {
    return (
      <TextField
        {...props}
        variant={variant}
        fullWidth={fullWidth}
        inputRef={ref}
        className={cn("rounded-lg h-9", className)}
        InputProps={{
          ...props.InputProps,
          classes: {
            ...props.InputProps?.classes,
          },
          className: cn("bg-white", props.InputProps?.className),
        }}
        inputProps={{
          ...props.inputProps,
          className: cn(
            "px-4 py-2 text-primary-text placeholder:text-placeholder",
            inputClassName,
            props.inputProps?.className,
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            height: "36px",
            "& fieldset": {
              borderColor: colors.hanasilver,
              borderWidth: 1,
            },
            "&:hover fieldset": {
              borderColor: colors.hanasilver,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.hanagreen.normal,
            },
          },
        }}
      />
    );
  },
);

Input.displayName = "Input";
export default Input;
