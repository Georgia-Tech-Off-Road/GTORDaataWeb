import { createContext } from "react";
import { Data, InputMode } from "./types";

interface IAppContext {
  ready: boolean;
  inputMode?: InputMode;
  setInputMode: (inputMode: InputMode | undefined) => void;
  ports: string[];
  data: Data;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
