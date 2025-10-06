// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: { extend: {} },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(10,10,10)",        // dark base
          light: "rgb(245,246,248)",       // light base
        },
        text: {
          primary: {
            DEFAULT: "rgb(245,245,245)",   // dark mode text
            light: "rgb(25,25,28)",        // light mode text
          },
          secondary: {
            DEFAULT: "rgb(160,160,160)",
            light: "rgb(90,90,95)",
          },
        },
        border: {
          subtle: {
            DEFAULT: "rgba(255,255,255,0.1)",
            light: "rgba(0,0,0,0.1)",
          },
        },
        accent: {
          red: "#f87171",
          cyan: "#22d3ee",
          teal: "#2dd4bf",
        },
      },
    },
  },
  plugins: [],
};
