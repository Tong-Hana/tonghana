import { cva } from "class-variance-authority";

export const tagVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors duration-200",
  {
    variants: {
      variant: {
        filled: "bg-hanagreen-light text-hanagreen-normal",
        outlined:
          "bg-white text-hanagreen-normal border border-hanagreen-light border-[2px]",
        interactive: "bg-hanagreen-light text-hanagreen-normal",
        selected: "bg-hanagreen-normal text-hanagreen-light",
      },
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base rounded-3xl",
        xl: "px-6 py-3 text-lg rounded-3xl",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
      disabled: false,
    },
  },
);
