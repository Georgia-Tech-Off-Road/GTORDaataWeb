export type InputMode = {
  name: string;
  data?: string | Uint8Array;
};

export type ServerMessage = {
  inputMode?: InputMode;
  ports?: string[];
  packet?: number[];
};

export type ClientMessage = {
  inputMode?: InputMode;
  graphs: number[];
};

export type Data = {
  [key: number]: number[][];
};
