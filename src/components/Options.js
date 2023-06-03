import { useGameStates } from "./StatesContextProvider.js";

import { useState } from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";

export default function Options({ toggleOrientation }) {
  const { options, setOptions } = useGameStates();

  const [showOptions, setShowOptions] = useState(false);

  function toggleOrientation() {
    if (options.orientation == "SOUTH") {
      setOptions({ orientation: "NORTH" });
    } else {
      setOptions({ orientation: "SOUTH" });
    }
  }

  function toggleSync() {
    setOptions({ sync: !options.sync });
  }

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
          <Box>
            <Link href={"https://github.com/nc108x/2023-scoreboard#disclaimer"} target="_blank">
              {"Help"}
            </Link>
          </Box>
          <Box>{"Options:"}</Box>
          <Box>
            <FormControlLabel
              control={<Switch onChange={toggleOrientation} />}
              label="Use blue perspective"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={<Switch onChange={toggleSync} />}
              label="Sync"
            />
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
