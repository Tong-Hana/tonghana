"use client";

import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import { colors } from "@/components/common/input/styles";

export interface CustomInputProps extends Omit<TextFieldProps, "variant"> {
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  variant?: "outlined" | "standard";
  unit?: string;
  unitPosition?: "start" | "end";
}

const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      inputClassName,
      fullWidth = false,
      variant = "outlined",
      unit,
      unitPosition = "end",
      ...props
    },
    ref,
  ) => {
    const adornment =
      unit && unit.length > 0 ? (
        <InputAdornment position={unitPosition}>
          <span className="text-placeholder text-sm">{unit}</span>
        </InputAdornment>
      ) : null;

    return (
      <TextField
        {...props}
        variant={variant}
        fullWidth={fullWidth}
        inputRef={ref}
        className={cn("rounded-lg h-9", className)}
        InputProps={{
          ...props.InputProps,
          endAdornment:
            unitPosition === "end" ? adornment : props.InputProps?.endAdornment,
          startAdornment:
            unitPosition === "start"
              ? adornment
              : props.InputProps?.startAdornment,
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
