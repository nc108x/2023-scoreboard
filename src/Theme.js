import { createTheme } from "@mui/material/styles";
import "@fontsource/cascadia-code";

const theme = createTheme({
  typography: {
    fontFamily: "Cascadia Code",
  },

  palette: {
    background: {
      default: "#cdd6f4",
    },
    redTeam: {
      main: "#ff6161",
      dark: "#e64949",
    },
    blueTeam: {
      main: "#89b4fa",
      dark: "#8caaee",
    },
    standbyColor: {
      main: "#959595",
      dark: "#808080",
    },
  },
});

export default theme;
