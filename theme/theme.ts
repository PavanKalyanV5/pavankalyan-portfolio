import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-sans, 'Inter', system-ui, sans-serif)",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
  },
};

export function getTheme(mode: "light" | "dark") {
  return createTheme({
    ...shared,
    palette:
      mode === "dark"
        ? {
            mode: "dark",
            background: { default: "#0B0E14", paper: "#12161F" },
            primary: { main: "#4F9DFF" },
            secondary: { main: "#8A5CFF" },
          }
        : {
            mode: "light",
            background: { default: "#F7F8FA", paper: "#FFFFFF" },
            primary: { main: "#2E6FE0" },
            secondary: { main: "#6A3FE0" },
          },
  });
}
