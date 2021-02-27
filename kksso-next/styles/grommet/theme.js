export const theme = {
  global: {
    font: {
      family: "Nunito Sans",
      size: "16px",
      height: "20px",
      color: "#4b4b4b",
    },
    colors: {
      // Overriding existing colors
      brand: "#ff4500",
      "accent-1": "#6FFFB0",
      "accent-2": "#7FFFB0",
      "accent-3": "#8FFFB0",
      "accent-4": "#9FFFB0",
      "neutral-1": "#10873D",
      "neutral-2": "#20873D",
      "neutral-3": "#30873D",
      "neutral-4": "#40873D",
      focus: "#000",
      // Setting new colors
      blue: "#00C8FF",
      green: "#17EBA0",
      teal: "#82FFF2",
      purple: "#F740FF",
      red: "#FC6161",
      orange: "#FFBC44",
      yellow: "#FFEB59",
      // you can also point to existing grommet colors
      brightGreen: "accent-1",
      deepGreen: "neutral-2",
      // Changing default text color,
      // all colors could be either a string or a dark and light object
      text: {
        dark: "#222",
        light: "#4b4b4b",
      },
    },
  },
  button: {
    default: {
      // secondary: {
      //   color: "text",
      //   active: {
      //     color: "brand",
      //   },
      // },
    },
    border: { color: "brand" },
    primary: {
      color: "brand",
      active: {
        color: "#ff4500",
      },
    },
    secondary: {
      border: { color: "brand" },
      color: "#4b4b4b",
      active: {
        extend: `background: #4b4b4b; border: 1px solid #ff4500;`,
        // background: {
        //   color: "#ff4500",
        // },
      },
    },
  }, // enabling kind button functionality
};
