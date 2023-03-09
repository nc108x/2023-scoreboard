import { createTheme } from "@mui/material/styles";
/* import "@fontsource/fira-mono"; */
/* import "@fontsource/oxygen-mono"; */
/* import "@fontsource/courier-prime"; */
/* import "@fontsource/space-mono"; */
import "@fontsource/roboto-mono";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Mono",
  },

  palette: {
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
