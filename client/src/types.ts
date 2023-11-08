export type InputMode = {
  name: string;
  data?: string | Uint8Array;
};

export type ServerMessage = {
  inputMode?: InputMode;
  ports?: string[];
  packet?: number[];
};

export type Sensor = {
  name: string;
  values: {
    name?: string;
    bytes: number;
    type: "boolean" | "uint" | "int" | "float";
    units?: string;
  }[];
};

export type Data = {
  [key: number]: number[][];
};
