import { grommet, base, Paragraph } from "grommet";
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
      "brand-dark": "#AA8088",
      "accent-1": "#C0FFF4",
      "accent-1-dark": "#80AAA0",
      "dark-1": "#4b4b4b",

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
    active: {
      background: "brand",
      // color: "brand",
    },
    // selected: {
    //   background: "white",
    //   color: "brand",
    // },
  },
  paragraph: {
    small: {
      size: "16px",
      height: "22px",
    },
    medium: {
      size: "18px",
      height: "24px",
    },
  },
  heading: {
    color: "#4b4b4b",
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
          color: "#C0FFF4",
        },
      },
    },
    secondary: {
      color: "brand",
      active: {
        background: {
          color: "brand",
        },
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
      daySize: "30px",

      lineHeight: 1.6,
      fontSize: "14px",
    },
    small: {
      daySize: "28px",
    },
    day: {
      extend: ({ isSelected, isInRange }) => `
        border-radius: 100px;
        background-color: ${(isSelected || isInRange) && "#C0FFF4"}`,
    },
  },
  notification: {
    toast: {
      time: 6000,
      container: {
        pad: "medium",
        width: "medium",
        elevation: "medium",
        background: "white",
        round: "small",
        // zIndex: "1000", // Grommet layers usually handle this, but can be explicit if needed
      },
    },
    // General notification container (inner content)
    container: {
      pad: "small",
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
  select: {
    background: { color: "light-1" },
    icons: {
      color: "brand",
    },
  },
};

export default deepMerge(base, themeChanges);
