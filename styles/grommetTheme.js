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
    colors: {
      // overriding colors
      brand: "#FFC0CB",
      "accent-1": "#C0FFF4",
      "dark-1": "#4b4b4b",
      "brand-dark": "#D78EB7",
      control: "accent-1",
      focus: "#FFF",
      icon: "#FFC0CB",
    },
    font: {
      family: "Nunito Sans",
      size: "16px",
      height: "20px",
      color: "#4b4b4b",
    },
    // active: {
    //   background: "white",
    //   color: "brand",
    // },
    // selected: {
    //   background: "white",
    //   color: "brand",
    // },
  },
  heading: {
    level: {
      3: {
        medium: {
          size: "22px",
          height: "22px",
        },
      },
      4: {
        medium: {
          size: "20px",
          height: "20px",
        },
      },
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
  },
  tab: {
    color: "black",
    border: {
      // side: "bottom",
      // size: "small",
      color: "brand",
      active: {
        color: "black",
      },
      hover: {
        color: "black",
      },
    },
  },
  calendar: {
    heading: {
      level: "4",
    },
    medium: {
      daySize: "36px",
      lineHeight: 2.0,
      fontSize: "16px",
    },
    small: {
      daySize: "28px",
    },
    day: {
      extend: ({ isSelected }) => `
        border-radius: 100px;
        background-color: ${isSelected && "#C0FFF4"}`,
    },
  },
  checkBox: {
    border: {
      color: "black",
    },
    color: "black",
  },
  radioButton: {
    color: "brand",
    check: {
      color: "brand",
    },
    border: {
      color: "brand",
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
};

export default deepMerge(base, themeChanges);
