import { grommet, base } from "grommet";
import { deepMerge } from "grommet/utils";

// try
// https://theme-designer.grommet.io/

const themeChanges = {
  name: "kksso",
  rounding: 24,
  spacing: 24,
  defaultMode: "light",
  global: {
    font: {
      family: "Nunito Sans",
      size: "16px",
      height: "20px",
      color: "#4b4b4b",
    },
    colors: {
      // overriding colors
      brand: "#FFC0CB",
      "accent-1": "#C0FFF4",
      "dark-1": "4b4b4b",
      control: "accent-1",
    },
  },
  anchor: {
    color: "text",
  },
  button: {
    // extend: grommet.button.extend,
    padding: {
      vertical: "14px",
      horizontal: "22px",
    },
    border: {
      width: "1px",
      radius: "14px",
    },
    primary: {
      color: "accent-1",
      active: {
        background: {
          color: "#000",
        },
      },
    },
    secondary: {
      color: "brand",
      active: {
        color: "#C0FFF4",
      },
    },
    // size is useless
    // size: {
    //   large: {
    //     border: {
    //       radius: "14px",
    //     },
    //     pad: {
    //       vertical: "14px",
    //       horizontal: "22px",
    //     },
    //   },
    // },
  },
};

export default deepMerge(grommet, themeChanges);
