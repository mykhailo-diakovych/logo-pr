/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{html,js,vue}",
    "./src/components/**/*.{html,js,vue}",
    "./src/layouts/**/*.{html,js,vue}",
  ],
  theme: {
    colors: {
      black: "#000",
      white: "#fff",
      transparent: "transparent",
      alabaster: "#F7F7F7",
      bombay: "#AAAAAB",
      violet: {
        DEFAULT: "#261D3F",
        300: "#6001D3",
      },
      blue: "#3E80FA",
      "gray-5": "#d9d9d9",
      "port-gore": "#261D3F",
      gray: {
        DEFAULT: "#919191",
        1: "#8c8c8c",
        900: "#686868",
      },
      peach: "#F19876",
      alto: "#d3d3d3",
      gallery: "#f0f0f0",
      green: "#22986E",
      yellow: "#FCC959",
      red: "#EA3636",
      silverChalice: "#ababab",
    },
    extend: {},
  },
  plugins: [],
};
