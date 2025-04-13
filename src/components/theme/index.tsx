// themes/createDashboardTheme.ts
import { createTheme } from "@mui/material";

const createDashboardTheme = (mode: "light" | "dark") => {
  const isDarkMode = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDarkMode ? "#81d4fa" : "#4fc3f7", // Main accent blue
        dark: "#0288d1", // Darker shade for button and icon interactions
        light: "#b3e5fc", // Light shade for secondary emphasis
      },
      secondary: {
        main: "#f57c00", // Contrasting orange for highlights
      },
      background: {
        default: isDarkMode ? "#fff" : "#fff",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#e0e0e0" : "#212121",
        secondary: isDarkMode ? "#b0b0b0" : "#757575",
      },
      action: {
        active: isDarkMode ? "#ffffff" : "#212121",
        hover: isDarkMode ? "#333333" : "#eeeeee",
        disabled: isDarkMode ? "#666666" : "#b0b0b0",
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: {
        fontSize: "2.1rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "1.85rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.6rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.9rem",
        fontWeight: 400,
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? "#212121" : "#e3f2fd", // Light blue shade in light mode
            // boxShadow: isDarkMode ? "0px 4px 8px rgba(0, 0, 0, 0.3)" : "0px 2px 8px rgba(0, 0, 0, 0.1)",
            padding: "8px 24px",
            height: "64px",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
        },
        styleOverrides: {
          root: {
            padding: "10px 24px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            background: isDarkMode
              ? "linear-gradient(135deg, #4fc3f7 30%, #0288d1 90%)"
              : "linear-gradient(135deg, #81d4fa 30%, #4fc3f7 90%)",
            // "&:hover": {
            //   background: isDarkMode ? "#4fc3f7" : "#0288d1",
            //   boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
            // },
            "&.Mui-disabled": {
              backgroundColor: "#b0b0b0",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "24px",
            // boxShadow: isDarkMode ? "0px 2px 8px rgba(0, 0, 0, 0.3)" : "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            // "&:hover": {
            //   boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
            // },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? "#e0e0e0" : "#212121",
            "&:hover": {
              backgroundColor: isDarkMode ? "#444444" : "#f0f0f0",
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            padding: "0px",
            minHeight: "64px",
          },
        },
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
    },
  });
};

export default createDashboardTheme;
