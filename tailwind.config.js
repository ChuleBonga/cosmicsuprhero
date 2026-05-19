/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        archive: {
          void: "#040405",
          ink: "#080b13",
          navy: "#101527",
          bronze: "#7f6546",
          ember: "#d79a48",
          amber: "#f0bf72",
          dust: "#b88a58",
          violet: "#7c6fd5",
          blood: "#6b1715",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Times New Roman"', "serif"],
        body: ['"Inter"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        ember: "0 0 80px rgba(215, 154, 72, 0.24)",
        portal: "inset 0 0 42px rgba(240, 191, 114, 0.12), 0 24px 80px rgba(0, 0, 0, 0.42)",
      },
      backgroundImage: {
        "radial-signal":
          "radial-gradient(circle at 50% 20%, rgba(215,154,72,0.24), rgba(8,11,19,0.1) 34%, rgba(4,4,5,0) 62%)",
      },
    },
  },
  plugins: [],
};
