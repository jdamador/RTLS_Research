__author__ = "Jose Daniel Amador (jdamador)"
__credits__ = ["UNAD, Pasto - Colombia", "TEC, San Carlos - Costa Rica"]
__license__ = "Apache 2.0"
__version__ = "1.0"
__maintainer__ = "jdamador"
__email__ = "jdamadorsalas@gmail.com"

import time

# Serial Port Settings
import serial 
DWM = serial.Serial(port="/dev/ttyACM0",baudrate=115200)
print("Connected to " + DWM.name)
DWM.write("\r\r".encode())
time.sleep(1)
DWM.write("les\r".encode())
time.sleep(1)
try:
    while True:
        data = DWM.readline()
        if data:
            parse = data.translate(None, b'\r\n').decode().split(",")
            if len(parse) > 5:
                print(parse)
    DWM.write("\r".encode())
    DWM.close()

except KeyboardInterrupt:
    print("Stop")
