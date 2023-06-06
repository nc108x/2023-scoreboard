import { useGameStates } from "./StatesContextProvider.js";

import { digestMessage } from "./PasswordHashing.js";

import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { enqueueSnackbar } from "notistack";

import Link from "@mui/material/Link";
import emptyExcel from "../results_blank.xlsx";

export function ResetPrompt({
  showConfirmReset,
  setShowConfirmReset,
  resetHandler,
}) {
  const { options } = useGameStates();

  return (
    <Dialog
      open={showConfirmReset}
      onClose={() => {
        setShowConfirmReset(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Reset current game state?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography paragraph="true">
            {
              "All poles will be emptied. This action cannot be undone because I am too lazy to implement this feature."
            }
          </Typography>
          <Typography paragraph="true">
            {options.sync
              ? "WARNING: SYNC IS ENABLED. RESETTING CURRENT GAME STATE WILL AFFECT ALL OTHERS CURRENTLY SYNCED."
              : ""}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowConfirmReset(false);
          }}
          autoFocus
        >
          {"等等先不要"}
        </Button>
        <Button
          onClick={() => {
            setShowConfirmReset(false);
            resetHandler();
          }}
        >
          {"繼續開game啦咁多野講"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ExportPrompt({ showExport, setShowExport, exportData }) {
  return (
    <Dialog
      open={showExport}
      onClose={() => {
        setShowExport(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Export data"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography paragraph="true">
            {"Copy the following to the Excel spreadsheet:\n\n"}
          </Typography>
          <Typography>{exportData(0)}</Typography>
          <Typography paragraph="true">
            {"("}
            <Link href={emptyExcel} download="results_blank.xlsx">
              {"Blank spreadsheet download here"}
            </Link>
            {")"}
          </Typography>
          <Typography>{"Pole states:"}</Typography>
          <Typography>{exportData(1)}</Typography>
          <Typography>
            {
              "NOTE: use CTRL+SHIFT+V when pasting this string to keep formatting"
            }
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowExport(false);
          }}
          autoFocus
        >
          {"Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function SyncPrompt({ showConfirmSync, setShowConfirmSync }) {
  const { setOptions } = useGameStates();

  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function checkPassword() {
    digestMessage(passwordInput).then((digestHex) => {
      if (digestHex == process.env.REACT_APP_ROBOCON_CATCHPHRASE) {
        setShowPwPrompt(false);
        setOptions({ sync: true });

        enqueueSnackbar("Sync has been enabled.", {
          variant: "success",
        });
      } else {
        setPasswordError(true);
      }
    });
  }

  return (
    <>
      <Dialog
        open={showConfirmSync}
        onClose={() => {
          setShowConfirmSync(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sync game state across multiple instances?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography paragraph="true">
              {
                "Changes you make to the scoreboard will be reflected across all other instances of the scoreboard that also have sync enabled."
              }
            </Typography>
            <Typography paragraph="true">
              {
                "To avoid unintended behavior, make sure all users have enabled sync BEFORE anyone starts the timer."
              }
            </Typography>
            <Typography paragraph="true" sx={{ fontSize: 10 }}>
              {"pls do this I don't wanna debug |･ω･)"}
            </Typography>
            <Typography paragraph="true">
              {
                "WARNING: ENABLING SYNC WILL OVERWRITE THE CURRENT LOCAL GAME STATE."
              }
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowConfirmSync(false);
            }}
            autoFocus
          >
            {"等等先不要"}
          </Button>
          <Button
            onClick={() => {
              setShowConfirmSync(false);
              setShowPwPrompt(true);
              setPasswordError(false);
            }}
          >
            {"Link start"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showPwPrompt}
        onClose={() => {
          setShowPwPrompt(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Input password"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography paragraph="true">{"You shall not pass!"}</Typography>
            <TextField
              id="outlined-password-input"
              label="Password"
              variant="outlined"
              type="password"
              error={passwordError}
              helperText={passwordError ? "Bad grade for you (σﾟ∀ﾟ)σ" : ""}
              onChange={(e) => {
                setPasswordInput(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key == "Enter") {
                  checkPassword();
                }
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {checkPassword()}} autoFocus>
            {"SUBMIT"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
