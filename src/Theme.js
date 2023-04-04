import { createTheme } from "@mui/material/styles";
import "@fontsource/cascadia-code";

const theme = createTheme({
  typography: {
    fontFamily: "Cascadia Code",
  },

  palette: {
    /* mode: "dark", */
    redTeam: {
      main: "#f5c2e7",
      dark: "#f4b8e4",
    },
    blueTeam: {
      main: "#89b4fa",
      dark: "#8caaee",
    },
    standbyColor: {
      main: "#fab387",
      dark: "#ef9f76",
    },
  },
});

export default theme;
