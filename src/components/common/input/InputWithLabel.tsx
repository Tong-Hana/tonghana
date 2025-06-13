"use client";

import { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { cn } from "@/utils/cn";
import { colors } from "@/components/common/input/styles";

export interface InputWithLabelProps extends Omit<TextFieldProps, "variant"> {
  label: string;
  required?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
}

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      required = false,
      errorMessage,
      className,
      inputClassName,
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    return (
      <TextField
        {...props}
        inputRef={ref}
        variant="standard"
        fullWidth={fullWidth}
        label={
          <span>
            {label}
            {required && <span className="text-hanared-normal ml-1">*</span>}
          </span>
        }
        error={!!errorMessage}
        helperText={errorMessage}
        className={cn("text-base", className)}
        InputProps={{
          ...props.InputProps,
          disableUnderline: false,
          className: cn("text-hanasilver", props.InputProps?.className),
        }}
        inputProps={{
          ...props.inputProps,
          className: cn(
            "placeholder:text-placeholder px-0 py-2",
            inputClassName,
            props.inputProps?.className,
          ),
        }}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "1rem",
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: colors.hanasilver,
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: colors.hanasilver,
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: errorMessage
              ? colors.hanared.normal
              : colors.hanagreen.normal,
          },
        }}
      />
    );
  },
);

InputWithLabel.displayName = "InputWithLabel";
export default InputWithLabel;
