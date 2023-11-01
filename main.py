import asyncio
import json
from serial.tools import list_ports
from websockets.server import serve, WebSocketServerProtocol

from data_import import DataImport

data_import: DataImport = None

websocket: WebSocketServerProtocol = None


def get_input_mode():
  if data_import is None:
    return None
  return data_import.input_mode


async def set_input_mode(mode):
  global data_import
  if get_input_mode() == mode:
    return
  if data_import is not None:
    await data_import.close()
  if mode is not None:
    data_import = DataImport(mode, websocket)


async def read_message(msg):
  data: dict = json.loads(msg)
  print(data)
  if 'inputMode' in data:
    await set_input_mode(data['inputMode'])


async def send_loop():
  while True:
    if websocket is not None:
      ports = sorted([port.device for port in list_ports.comports()])
      msg = {
        'ports': ports,
        'inputMode': get_input_mode(),
      }
      await websocket.send(json.dumps(msg))
    await asyncio.sleep(2)


async def handler(ws: WebSocketServerProtocol):
  global websocket
  websocket = ws

  async for message in websocket:
    await read_message(message)


async def main():
  print('Starting send loop...')
  asyncio.create_task(send_loop())
  print('Send loop started\n')

  print('Starting websocket server...')
  async with serve(handler, 'localhost', 3001):
    print('Websocket server running on port 3001\n')

    await asyncio.Future()  # run forever


asyncio.run(main())