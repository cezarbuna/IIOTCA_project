import RPi.GPIO as GPIO
import time
import sys
import Adafruit_DHT as ada
import I2C_LCD_driver
from firebase_admin import credentials
from firebase_admin import firestore

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.IN, pull_up_down=GPIO.PUD_UP)

state = 0
mylcd = I2C_LCD_driver.lcd()
sensor = ada.DHT22
mylcd.lcd_clear()
mylcd.lcd_display_string('test', 1)

cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

try:
    while True:
        if GPIO.input(4) == GPIO.LOW:
            state = (state + 1) % 2
            time.sleep(1)
        
        humidity, temperature = ada.read_retry(sensor, 17)
        if humidity is not None and temperature is not None:
            print(temperature)
            if state == 0:
                mylcd.lcd_clear()
                mylcd.lcd_display_string('Temp={0:0.1f}*C'.format(temperature), 1)
                mylcd.lcd_display_string('Humidity={0:0.1f}%'.format(humidity), 2)
            else:
                mylcd.lcd_clear()
                temperature = temperature + 273.15
                mylcd.lcd_display_string('Temp={0:0.1f}*K'.format(temperature), 1)
                mylcd.lcd_display_string('Humidity={0:0.1f}%'.format(humidity), 2)
            
            measurement_one = {
                "record_type": "temperature",
                "record_value": 'Temp={0:0.1f}*C'.format(temperature),
                "thing_type": "HumSensor"
            }
            measurement_two = {
                "record_type": "humidity",
                "record_value": 'Humidity={0:0.1f}%'.format(humidity),
                "thing_type": "HumSensor"
            }
            db.collection(u'records').add(measurement_one)
            db.collection(u'records').add(measurement_two)
        else:
            mylcd.lcd_clear()
            mylcd.lcd_display_string('No values')
            time.sleep(1)

except KeyboardInterrupt:
    mylcd.lcd_clear()
    mylcd.lcd_display_string('Thanks !', 1)