import { Sensor } from "../types";

interface Sensors {
  [key: string]: Sensor;
}

export const sensors: Sensors = {
  // 000 - DEFAULTS, FLAGS, COMMANDS, MISC
  0: {
    name: "default_no_sensor",
    values: [],
  },
  8: {
    name: "gps_sensor",
    values: [
      { name: "latitute", bytes: 4, type: "int" },
      { name: "longitude", bytes: 4, type: "int" },
      { name: "speed", bytes: 4, type: "uint" },
    ],
  },
  9: {
    name: "command_auxdaq_sdwrite",
    values: [{ bytes: 1, type: "boolean" }],
  },
  10: {
    name: "flag_auxdaq_sdwrite",
    values: [{ bytes: 1, type: "boolean" }],
  },

  // 100 - TIME "SENSORS"
  105: {
    name: "time_auxdaq_us",
    values: [{ bytes: 4, type: "uint", units: "us" }],
  },

  // 200 - SPEED/POSITION SENSORS
  214: {
    name: "speed_2021car_engine600_rpm",
    values: [
      { name: "position", bytes: 4, type: "uint", units: "ticks" },
      { name: "speed", bytes: 2, type: "uint", units: "rpm" },
    ],
  },
  215: {
    name: "speed_2021car_engine30_rpm",
    values: [
      { name: "position", bytes: 4, type: "uint", units: "ticks" },
      { name: "speed", bytes: 2, type: "uint", units: "rpm" },
    ],
  },

  // 300 - FORCE/PRESSURE SENSORS
  304: {
    name: "pressure_frontbrake_psi",
    values: [{ bytes: 4, type: "float", units: "psi" }],
  },
  305: {
    name: "pressure_rearbrake_psi",
    values: [{ bytes: 4, type: "float", units: "psi" }],
  },

  // 400 - LDS SENSORS
  401: {
    name: "lds_frontleftshock_mm",
    values: [{ bytes: 4, type: "float", units: "mm" }],
  },
  402: {
    name: "lds_frontrightshock_mm",
    values: [{ bytes: 4, type: "float", units: "mm" }],
  },
  403: {
    name: "lds_backleftshock_mm",
    values: [{ bytes: 4, type: "float", units: "mm" }],
  },
  404: {
    name: "lds_backrightshock_mm",
    values: [{ bytes: 4, type: "float", units: "mm" }],
  },

  // 500 - IMU SENSORS
  500: {
    name: "imu_sensor",
    values: [
      { name: "accel_x", bytes: 4, type: "float", units: "m/s^2" },
      { name: "accel_y", bytes: 4, type: "float", units: "m/s^2" },
      { name: "accel_z", bytes: 4, type: "float", units: "m/s^2" },
      { name: "gyro_x", bytes: 4, type: "float", units: "rad" },
      { name: "gyro_y", bytes: 4, type: "float", units: "rad" },
      { name: "gyro_z", bytes: 4, type: "float", units: "rad" },
      { name: "temp", bytes: 4, type: "float", units: "C" },
    ],
  },
  502: {
    name: "dashboard_imu_wt901_tennessee",
    values: [
      { name: "accel_x", bytes: 4, type: "float", units: "m/s^2" },
      { name: "accel_y", bytes: 4, type: "float", units: "m/s^2" },
      { name: "accel_z", bytes: 4, type: "float", units: "m/s^2" },
      { name: "roll", bytes: 4, type: "float", units: "rad" },
      { name: "pitch", bytes: 4, type: "float", units: "rad" },
      { name: "yaw", bytes: 4, type: "float", units: "rad" },
      { name: "quaternion_1", bytes: 4, type: "float" },
      { name: "quaternion_2", bytes: 4, type: "float" },
      { name: "quaternion_3", bytes: 4, type: "float" },
      { name: "quaternion_4", bytes: 4, type: "float" },
    ],
  },

  // 600 - MISC SENSORS
};
