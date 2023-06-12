import { useGameStates } from "./StatesContextProvider.js";

import { SyncPrompt } from "./Prompts.js";

import { useState } from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";

import { enqueueSnackbar } from "notistack";

export default function Options({}) {
  const { options, setOptions } = useGameStates();

  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmSync, setShowConfirmSync] = useState(false);

  function toggleOrientation() {
    if (options.orientation == "SOUTH") {
      setOptions({ orientation: "NORTH" });
    } else {
      setOptions({ orientation: "SOUTH" });
    }
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
            <Link
              href={"https://github.com/nc108x/2023-scoreboard#disclaimer"}
              target="_blank"
            >
              {"Help"}
            </Link>
          </Box>
          <Box>{"Options:"}</Box>
          <Box>
            <FormControlLabel
              control={<Switch defaultChecked={true} onChange={() => setOptions({labels: !options.labels})} />}
              label="Toggle pole labels"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={<Switch onChange={toggleOrientation} />}
              label="Use blue perspective"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={options.sync}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowConfirmSync(true);
                    } else {
                      setOptions({ sync: false });

                      enqueueSnackbar("Sync has been disabled.", {
                        variant: "success",
                      });
                    }
                  }}
                />
              }
              label="Sync"
            />
          </Box>
        </Box>
      </SwipeableDrawer>

      <SyncPrompt
        showConfirmSync={showConfirmSync}
        setShowConfirmSync={setShowConfirmSync}
      />
    </>
  );
}
