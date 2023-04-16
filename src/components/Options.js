import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function Options({ toggleOrientation }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowOptions(true)}
        sx={{ position: "absolute", left: 10, top: 10 }}
      >
        <MenuIcon />
      </Button>
      <SwipeableDrawer
        anchor={"left"}
        open={showOptions}
        onClose={() => setShowOptions(false)}
      >
        <Box sx={{ margin: 2 }}>
          <Box>Options:</Box>
          <FormControlLabel
            control={<Switch onChange={toggleOrientation} />}
            label="Use blue perspective"
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
