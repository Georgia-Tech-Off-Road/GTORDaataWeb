import asyncio
import random
import serial
import struct
from typing import Awaitable, Callable


class DataImport:
  def __init__(self, input_mode: dict, send: Callable[[list[int]], Awaitable[None]]):
    self.input_mode = input_mode
    self.send = send
    self.teensy_ser = None

    self.start_code = [0xee, 0xe0]
    self.end_code = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf0]
    self.current_packet = []
    self.packets_received = 0

    self.stop_thread = asyncio.Event()

    self.read_data_task = asyncio.create_task(self.read_data())

    print(f'Started data import with mode {input_mode}')

  
  def gen_fake_packet(self):
    packet = []
    if self.packets_received < 5:
      settings = [0x69, 0x00, 0x04, 0xd6, 0x00, 0x06, 0x30, 0x01, 0x04]
      packet = self.start_code + settings + self.end_code
    else:
      time = (self.packets_received * 500000).to_bytes(4, 'little')
      val1 = random.randint(1, 1000).to_bytes(4, 'little')
      val2 = random.randint(1, 1000).to_bytes(2, 'little')
      val3 = struct.pack('f', random.uniform(100.0, 1000.0))
      packet = self.start_code + list(time) + list(val1) + list(val2) + list(val3) + self.end_code
      packet[1] += 2
    return packet


  async def read_data(self):
    while not self.stop_thread.is_set():
      if self.input_mode['name'] == 'FAKE':
        self.current_packet = self.gen_fake_packet()

        self.packets_received += 1
        await self.send(self.current_packet)

        await asyncio.sleep(0.5)

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
                if len(self.current_packet) > len(self.end_code):
                  self.packets_received += 1
                  await self.send(self.current_packet)

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
