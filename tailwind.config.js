/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      boxShadow: {
        "card-shadow": "0px -1px 6px 0px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        hanagold: "#ad9a5f",
        hanasilver: "#b5b5b5",
        hanablack: "#000000",
        white: "#ffffff",
        background: "#f6f7f9",

        // Text colors
        "text-primary": "#495455",
        "text-secondary": "#979799",
        "text-placeholder": "#b8b8b8",
        "text-accent": "#333b3b",

        // Button colors
        "button-default-bg": "#f2f4f6",
        "button-default-text": "#d9d9d9",

        // Label colors
        label1: "#43bd9f",
        label2: "#3e9eca",
        label3: "#6979f1",
        label4: "#e780cd",
        label5: "#ff9562",
        label6: "#f4c143",
        label7: "#3f98fd",
        label8: "#a17ef9",

        // Foundation Colors - Hana Green
        hanagreen: {
          light: "#e6f3f3",
          "light-hover": "#d9eded",
          "light-active": "#b0d9d9",
          normal: "#008485",
          "normal-hover": "#007778",
          "normal-active": "#006a6a",
          dark: "#006364",
          "dark-hover": "#004f50",
          "dark-active": "#003b3c",
          darker: "#002e2f",
        },

        // Foundation Colors - Hana Red
        hanared: {
          light: "#fde6ef",
          "light-hover": "#fcd9e7",
          "light-active": "#f8b0ce",
          normal: "#e90061",
          "normal-hover": "#d20057",
          "normal-active": "#ba004e",
          dark: "#af0049",
          "dark-hover": "#8c003a",
          "dark-active": "#69002c",
          darker: "#520022",
        },
      },
    },
  },
  plugins: [],
};
