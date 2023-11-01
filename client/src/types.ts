export type InputMode = {
  name: string;
  data?: string | Uint8Array;
};

export type ServerMessage = {
  inputMode?: InputMode;
  ports?: string[];
};

export type ClientMessage = {
  inputMode?: InputMode;
  graphs: number[];
};
