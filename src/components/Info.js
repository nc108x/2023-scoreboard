import Paper from "@mui/material/Paper";
import theme from "../Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function Info({ score, dragonName, color }) {
  let bgColor;
  if (color == "red") {
    bgColor = "redTeam.main";
  } else {
    bgColor = "blueTeam.main";
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={13}
          sx={{
            width: "150px",
            height: "150px",
            backgroundColor: bgColor,
            borderRadius: 2,
            typography: "subtitle2",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          {dragonName + " DRAGON: \n" + score}{" "}
        </Paper>
      </ThemeProvider>
    </>
  );
}
