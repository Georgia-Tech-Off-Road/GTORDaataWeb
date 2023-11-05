import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import { Home } from "./components/Home";
import { NavBar } from "./components/NavBar";
import { Data, InputMode, ServerMessage } from "./types";

function App() {
  const [ready, setReady] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>();
  const [ports, setPorts] = useState<string[]>([]);
  const [data, setData] = useState<Data>({} as Data);

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
  }, [inputMode, ws, ws.readyState]);

  useEffect(() => {
    ws.onmessage = (e) => {
      const data: ServerMessage = JSON.parse(e.data);
      console.log(data);

      setReady(true);

      if (data.inputMode && data.inputMode?.name !== inputMode?.name) {
        setInputMode(data.inputMode);
      }

      if (data.ports && ports.toString() !== data.ports.toString()) {
        setPorts(data.ports);
      }

      if (data.packet) {
        // unpacketize(data.packet, setData);
      }
    };
  }, [inputMode, ports, ws]);

  return (
    <AppContext.Provider
      value={{
        ready,
        inputMode,
        setInputMode,
        ports,
        data,
      }}
    >
      <Stack height="100vh">
        <NavBar />
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
    </AppContext.Provider>
  );
}

export default App;
