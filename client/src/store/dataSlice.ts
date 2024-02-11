import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Data } from "../types";
import { sensors } from "../util/sensors";

const startCode = [0xee, 0xe0];
const endCode = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0];

export interface DataState {
  data: Data;

  isSendingData: boolean;
  isReceivingData: boolean;
  expectedSize: number;

  currentSensors: number[];
  outputSensors: number[];

  outboundPacket: number[];
}

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    isSendingData: false,
    isReceivingData: false,
    expectedSize: 4,
    currentSensors: [],
    outputSensors: [],
    outboundPacket: [],
  } as DataState,
  reducers: {
    unpacketize: (state: DataState, action: PayloadAction<number[]>) => {
      let packet: number[] = action.payload;

      const ackOffset = (startCode[0] << 8) + startCode[1];
      const ackCode = (packet[0] << 8) + packet[1] - ackOffset;

      packet = packet.slice(2, -8); // remove start and end code

      if (ackCode === 0x01 || ackCode === 0x03) {
        state.isSendingData = true;
      }
      if (ackCode === 0x00 || ackCode === 0x02) {
        state.isSendingData = false;
      }

      // if 0x02, then parse data but send settings
      // if 0x03, then parse data and send data
      if (ackCode === 0x02 || ackCode === 0x03) {
        if (packet.length >= state.expectedSize) {
          packet = packet.slice(0, state.expectedSize);

          for (const sensorId of state.currentSensors) {
            const sensorData = sensors[sensorId].values;
            const values: number[] = [];

            for (const value of sensorData) {
              const view = new DataView(new ArrayBuffer(value.bytes));
              for (let i = 0; i < value.bytes; i++) {
                view.setUint8(i, packet[0]);
                packet.shift();
              }

              if (value.type === "boolean") {
                values.push(view.getUint8(0));
              } else if (value.type === "float") {
                if (value.bytes === 4) {
                  values.push(view.getFloat32(0, true));
                } else if (value.bytes === 8) {
                  values.push(view.getFloat64(0, true));
                }
              } else if (value.type === "int") {
                if (value.bytes === 2) {
                  values.push(view.getInt16(0, true));
                } else if (value.bytes === 4) {
                  values.push(view.getInt32(0, true));
                }
              } else if (value.type === "uint") {
                if (value.bytes === 2) {
                  values.push(view.getUint16(0, true));
                } else if (value.bytes === 4) {
                  values.push(view.getUint32(0, true));
                }
              }
            }

            if (values.length === sensorData.length) {
              if (sensorId in state.data) {
                state.data[sensorId].push(values);
              } else {
                state.data[sensorId] = [values];
              }
            } else {
              console.log("INVALID CONFIG"); // TODO: bug in value parsing
            }
          }
        } else {
          console.log("INVALID PACKET"); // TODO: handle this : differing packet length
        }

        // 0x00, then parse settings and send settings
        // 0x01, then parse settings and send data
      } else if (ackCode === 0x00 || ackCode === 0x01) {
        // sets sensors from previous settings to disconnected
        state.currentSensors = [];
        state.expectedSize = 0;
        state.isReceivingData = false;

        if (packet.length % 3 === 0) {
          for (let i = 0; i < packet.length; i += 3) {
            const sensorId = packet[i] + (packet[i + 1] << 8);

            if (!(sensorId in sensors)) {
              console.log("INVALID SENSOR ID"); // TODO:handle this
              continue;
            }

            const numBytes = sensors[sensorId].values.reduce(
              (sum, i) => sum + i.bytes,
              0
            );

            if (numBytes !== packet[i + 2]) {
              console.log("FAILED SIZE CHECK"); // TODO:handle this
              continue;
            }

            state.currentSensors.push(sensorId);
            state.expectedSize += numBytes;
            state.isReceivingData = true;
          }
          console.log("Received settings of length: " + state.expectedSize);
        } else {
          console.log("INVALID PACKET"); // TODO:handle this
        }
      } else {
        console.log("INVALID ACK CODE", ackCode); // TODO:handle this
      }
    },
    packetize: (state: DataState) => {
      if (state.isSendingData) {
        const packet = [...startCode];

        // TODO

        packet.push(...endCode);
        packet[1] += state.isReceivingData ? 3 : 2;
        state.outboundPacket = packet;
      } else {
        const packet = [...startCode];

        for (const sensorId of state.outputSensors) {
          const sensorData = sensors[sensorId].values;
          const numBytes = sensorData.reduce((sum, i) => sum + i.bytes, 0);

          packet.push(sensorId & 0xff, (sensorId >> 8) & 0xff, numBytes);
        }

        packet.push(...endCode);
        packet[1] += state.isReceivingData ? 1 : 0;
        state.outboundPacket = packet;
      }
    },
  },
});

export const { unpacketize, packetize } = dataSlice.actions;

export default dataSlice.reducer;
