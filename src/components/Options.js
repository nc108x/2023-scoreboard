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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { enqueueSnackbar } from "notistack";

export default function Options({}) {
  const { gameState, setGameState, options, setOptions } = useGameStates();

  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmSync, setShowConfirmSync] = useState(false);

  function toggleOrientation() {
    if (options.orientation == "SOUTH") {
      setOptions({ orientation: "NORTH" });
    } else {
      setOptions({ orientation: "SOUTH" });
    }
  }

  function updateRedDragon(e) {
    setGameState({ redDragon: e.target.value });
  }

  function updateBlueDragon(e) {
    setGameState({ blueDragon: e.target.value });
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
              control={
                <Switch
                  defaultChecked={true}
                  onChange={() => setOptions({ labels: !options.labels })}
                />
              }
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

          <Box sx={{ m: 2 }} />

          <Box>
            <FormControl fullWidth>
              <InputLabel>{"RED TEAM "}</InputLabel>
              <Select
                value={gameState.redDragon}
                label="redteam"
                onChange={updateRedDragon}
              >
                <MenuItem value={"FIERY DRAGON"}>{"FIERY DRAGON"}</MenuItem>
                <MenuItem value={"WAR DRAGON"}>{"WAR DRAGON"}</MenuItem>
                <MenuItem value={"環掃千軍CUHK"}>{"環掃千軍CUHK"}</MenuItem>
                <MenuItem value={"一發入環CUHK"}>{"一發入環CUHK"}</MenuItem>
                <MenuItem value={"明德HKU"}>{"明德HKU"}</MenuItem>
                <MenuItem value={"格物HKU"}>{"格物HKU"}</MenuItem>
                <MenuItem value={"夢一城CITYU"}>{"夢一城CITYU"}</MenuItem>
                <MenuItem value={"夢成真CITYU"}>{"夢成真CITYU"}</MenuItem>
                <MenuItem value={"紅彗POLYU"}>{"紅彗POLYU"}</MenuItem>
                <MenuItem value={"赤影POLYU"}>{"赤影POLYU"}</MenuItem>
                <MenuItem value={"神機妙算IVE"}>{"神機妙算IVE"}</MenuItem>
                <MenuItem value={"疫境傳奇IVE"}>{"疫境傳奇IVE"}</MenuItem>
                <MenuItem value={"魯師EDU"}>{"魯師EDU"}</MenuItem>
                <MenuItem value={"虎地機動部隊LINGU"}>
                  {"虎地機動部隊LINGU"}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ m: 2 }} />

          <Box>
            <FormControl fullWidth>
              <InputLabel>{"BLUE TEAM "}</InputLabel>
              <Select
                value={gameState.blueDragon}
                label="blueteam"
                onChange={updateBlueDragon}
              >
                <MenuItem value={"FIERY DRAGON"}>{"FIERY DRAGON"}</MenuItem>
                <MenuItem value={"WAR DRAGON"}>{"WAR DRAGON"}</MenuItem>
                <MenuItem value={"環掃千軍CUHK"}>{"環掃千軍CUHK"}</MenuItem>
                <MenuItem value={"一發入環CUHK"}>{"一發入環CUHK"}</MenuItem>
                <MenuItem value={"明德HKU"}>{"明德HKU"}</MenuItem>
                <MenuItem value={"格物HKU"}>{"格物HKU"}</MenuItem>
                <MenuItem value={"夢一城CITYU"}>{"夢一城CITYU"}</MenuItem>
                <MenuItem value={"夢成真CITYU"}>{"夢成真CITYU"}</MenuItem>
                <MenuItem value={"紅彗POLYU"}>{"紅彗POLYU"}</MenuItem>
                <MenuItem value={"赤影POLYU"}>{"赤影POLYU"}</MenuItem>
                <MenuItem value={"神機妙算IVE"}>{"神機妙算IVE"}</MenuItem>
                <MenuItem value={"疫境傳奇IVE"}>{"疫境傳奇IVE"}</MenuItem>
                <MenuItem value={"魯師EDU"}>{"魯師EDU"}</MenuItem>
                <MenuItem value={"虎地機動部隊LINGU"}>
                  {"虎地機動部隊LINGU"}
                </MenuItem>
              </Select>
            </FormControl>
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
