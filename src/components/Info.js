import Paper from "@mui/material/Paper";

export default function Info({ score, dragonName }) {
  return (
    <Paper
      elevation={13}
      sx={{
        width: "150px",
        height: "150px",
      }}
    >
      {dragonName + " DRAGON: \n" + score}
    </Paper>
  );
}
