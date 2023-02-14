import Paper from "@mui/material/Paper";

export default function Info({ score, dragonName, color }) {
  let bgColor;
  if (color == "red") {
    bgColor = "redTeam.main";
  } else {
    bgColor = "blueTeam.main";
  }

  return (
    <>
      <Paper
        elevation={13}
        sx={{
          width: "150px",
          height: "150px",
          backgroundColor: bgColor,
          borderRadius: 2,
          typography: "subtitle2",
          textAlign: "center",
          fontSize: 32,
        }}
      >
        {dragonName + "\nDRAGON: \n" + score}
      </Paper>
    </>
  );
}
