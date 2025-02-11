/** @type {import('tailwindcss').Config} */
export default  {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fcfcfc",
        "primary-5": "#614298",
        "gray-5": "#7d748c",
        "gray-2": "#d5d2d9",
        "gray-9": "#181126",
        "gray-7": "#4a4159",
        black: "#06030d",
      },
      spacing: {},
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        nunito: ['Nunito'],
      },
      borderRadius: {
        "13xl": "32px",
      },
    },
    fontSize: {
      base: "16px",
      sm: "14px",
      "13xl": "32px",
      inherit: "inherit",
    },
    
  },
  corePlugins: {
    preflight: false,
  },
};
