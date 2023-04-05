import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Info({
  score,
  dragonName,
  color,
  historyDelta,
  winner,
}) {
  let bgColor;
  if (color == "red") {
    bgColor = "redTeam.main";
  } else {
    bgColor = "blueTeam.main";
  }

  const ringsScored = historyDelta.filter(
    (element) => element[0] == color
  ).length;

  return (
    <>
      <Paper
        elevation={10}
        sx={{
          width: "330px",
          backgroundColor: bgColor,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4">{dragonName + "\nDRAGON"}</Typography>
        <Typography variant="h4">{score}</Typography>
        <Typography variant="h6">{"Rings scored: " + ringsScored}</Typography>
        <Typography variant="h6">
          {"Rings remaining: " + (40 - ringsScored)}
        </Typography>
        <Typography variant="h6">
          <Box sx={{ backgroundColor: "#a6e3a1", borderRadius: 2 }}>
            {winner == dragonName ? "GREAT VICTORY" : " "}
          </Box>
        </Typography>
      </Paper>
    </>
  );
}
