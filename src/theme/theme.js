import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#953c00ff",
      light: "#E67E22",
    },
    secondary: {
      main: "#8E4B10",
      light: "#B65C20",
    },
    background: {
      default: "#2c663d",
      paper: "rgba(255, 245, 230, 0.9)",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(211, 84, 0, 0.15)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 245, 230, 0.85) !important",
          border: "1px solid rgba(211, 84, 0, 0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: "llinear-gradient(135deg, #F39C12, #D35400)",
          color: "#fff",
          fontWeight: 600,
          "&:hover": {
            background: "linear-gradient(135deg, #F39C12, #D35400)",
          },
        },
        text: {
          color: "#D35400",
          "&:hover": {
            backgroundColor: "rgba(211, 84, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(169, 65, 0, 0.7)",
            },
            "&:hover fieldset": {
              borderColor: "#D35400",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#D35400",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#D35400",
            "&.Mui-focused": {
              color: "#D35400",
            },
          },
          "& .MuiInputBase-input": {
            "&::placeholder": {
              color: "rgba(211, 84, 0, 0.7)",
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(211, 84, 0, 0.05) !important",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#D35400",
          "&:hover": {
            backgroundColor: "rgba(0, 211, 116, 0.1)",
          },
        },
      },
    },
  },
});
