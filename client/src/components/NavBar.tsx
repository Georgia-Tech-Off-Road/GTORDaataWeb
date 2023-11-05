import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setInputMode } from "../store/inputSlice";

interface Props {
  ready: boolean;
}

export function NavBar(props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputMode = useAppSelector((state) => state.input.inputMode);
  const ports = useAppSelector((state) => state.input.ports);
  const dispatch = useAppDispatch();

  function selectFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      dispatch(setInputMode({ name: "BIN", data: new Uint8Array() }));
    }
    setAnchorEl(null);
  }

  function fakeInputMode() {
    dispatch(setInputMode({ name: "FAKE" }));
    setAnchorEl(null);
  }

  function comInputMode(name: string) {
    dispatch(setInputMode({ name }));
    setAnchorEl(null);
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" marginRight={3}>
          GTOR Daata
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        {props.ready && (
          <>
            <Typography variant="button" marginRight={0.5}>
              Input:
            </Typography>
            <Button
              color="inherit"
              sx={{ minWidth: 0 }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {inputMode?.name ?? "None"}
            </Button>
          </>
        )}
      </Toolbar>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={fakeInputMode}>Fake Data</MenuItem>
        <label>
          <MenuItem>
            Select File
            <input type="file" hidden onChange={selectFile} />
          </MenuItem>
        </label>
        {ports.map((port) => (
          <MenuItem onClick={() => comInputMode(port)} key={port}>
            {port}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
