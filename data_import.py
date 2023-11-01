import asyncio
import json
import serial
from websockets.server import WebSocketServerProtocol


class DataImport:
  def __init__(self, input_mode: dict, websocket: WebSocketServerProtocol):
    self.input_mode = input_mode
    self.websocket = websocket
    self.teensy_ser = None

    self.start_code = [0xee, 0xe0]
    self.end_code = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0]
    self.current_packet = []
    self.packets_received = 0

    self.stop_thread = asyncio.Event()

    self.read_data_task = asyncio.create_task(self.read_data())

    print(f'Started data import with mode {input_mode}')


  async def receive_packet(self):
    self.packets_received += 1
    msg = {
      'packet': self.current_packet,
    }
    await self.websocket.send(json.dumps(msg))
    print(f'Received packet {self.packets_received} of length {len(self.current_packet)}')


  async def read_data(self):
    while not self.stop_thread.is_set():
      if self.input_mode['name'] == 'FAKE':
        self.current_packet = self.start_code + [0x00, 0x00, 0x00, 0x00, 0x00, 0x00] + self.end_code
        await self.receive_packet()
        await asyncio.sleep(2.0)

      elif self.input_mode['name'] == 'BIN':  
        pass

      else:
        try:
          if self.teensy_ser is None:
            self.teensy_ser = serial.Serial(baudrate=9600, port=self.input_mode['name'],
                                            timeout=1, write_timeout=1)

          if self.teensy_ser.in_waiting > 0:
            all_bytes = self.teensy_ser.read_all()
            for i in all_bytes:
              self.current_packet.append(i)

              if len(self.current_packet) >= len(self.end_code) and self.current_packet[-len(self.end_code):] == self.end_code:
                if self.current_packet[:len(self.start_code)] == self.start_code:
                  await self.receive_packet()

                self.current_packet.clear()
        except serial.SerialException:
          print(f'Could not connect to {self.input_mode["name"]}')
        except Exception as e:
          print(f'Error while reading from serial: {e}')
      
      await asyncio.sleep(0.02)


  def connected(self):
    if self.input_mode['name'] in ['FAKE', 'BIN']:
      return True
    return self.teensy_ser is not None and self.teensy_ser.is_open
  

  async def close(self):
    self.stop_thread.set()
    await self.read_data_task

    if self.teensy_ser is not None:
      self.teensy_ser.close()

    print('Closed data import')
