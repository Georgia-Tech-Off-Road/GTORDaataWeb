import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Home } from "./components/Home";
import { NavBar } from "./components/NavBar";
import { useAppDispatch, useAppSelector } from "./hooks";
import { ServerMessage } from "./types";
import { setInputMode, setPorts } from "./store/inputSlice";
import { packetize, unpacketize } from "./store/dataSlice";

function App() {
  const [ready, setReady] = useState(false);

  const inputMode = useAppSelector((state) => state.input.inputMode);
  const ports = useAppSelector((state) => state.input.ports);
  const outboundPacket = useAppSelector((state) => state.data.outboundPacket);

  const dispatch = useAppDispatch();

  const ws = useMemo(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onclose = () => {
      setReady(false);
    };

    return ws;
  }, []);

  useEffect(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ inputMode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  useEffect(() => {
    if (ws.readyState === WebSocket.OPEN && ports.length > 0) {
      ws.send(JSON.stringify({ packet: outboundPacket }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outboundPacket]);

  useEffect(() => {
    ws.onmessage = (e) => {
      const data: ServerMessage = JSON.parse(e.data);
      console.log(data);

      setReady(true);

      if (data.inputMode && data.inputMode?.name !== inputMode?.name) {
        dispatch(setInputMode(data.inputMode));
      }

      if (data.ports && ports.toString() !== data.ports.toString()) {
        dispatch(setPorts(data.ports));
      }

      if (data.packet) {
        dispatch(unpacketize(data.packet));
        dispatch(packetize());
      }
    };
  }, [dispatch, inputMode, ports, ws]);

  return (
    <Stack height="100vh">
      <NavBar ready={ready} />
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        {ready ? (
          <Home />
        ) : (
          <Stack
            height="100%"
            alignItems="center"
            justifyContent="center"
            spacing={4}
          >
            <CircularProgress />
            <p>Connecting to server...</p>
          </Stack>
        )}
      </div>
    </Stack>
  );
}

export default App;
