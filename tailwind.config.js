/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens: {
 
      sm: "310px",
      // => @media (min-width: 576px) { ... }

      md: "960px",
      // => @media (min-width: 960px) { ... }

      lg: "1440px",
      // => @media (min-width: 1440px) { ... }
      xlg: "1800px",
      // => @media (min-width: 1800px) { ... }
    },
    extend: {},
  },
  plugins: [],
}

