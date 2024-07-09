"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      // light: "#757ce8",
      main: "#003B46",
      // dark: "#002884",
      // contrastText: "#fff",
    },
    secondary: {
      // light: "#ff7961",
      main: "#66A5AD",
      // dark: "#ba000d",
      contrastText: "#fff",
    },
  },
});

const CustomeThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default CustomeThemeProvider;
