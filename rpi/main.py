from camera import Camera
from sensors import GroveMoistureSensor, LightSensor
from display import Display
from rele import RelayControl
from datetime import datetime
import requests
import seeed_dht
import schedule
import time
import os

settingsUrl = 'http://192.168.137.1:3000/plant-settings'
wateringUrl = 'http://192.168.137.1:3000/watering'
url = 'http://192.168.137.1:3000/upload'
watering_duration = 2
capture_interval = 1

img_path = os.path.join(os.getcwd(), "images")

display = Display()
light_sensor = LightSensor(2)
sensor_moisture = GroveMoistureSensor(0)
dht = seeed_dht.DHT("11", 5)
relay = RelayControl(16)
camera = Camera(img_path, url)

def readSensors():
    try:
        moist = sensor_moisture.read()
        humi, temp = dht.read()
        light = light_sensor.read()
        return moist, humi, temp, light
    except Exception as e:
        print("Chyba při čtení senzorů:", str(e))
        return None

def fetch_and_apply_settings():
    global watering_duration, capture_interval
    try:
        response = requests.get(settingsUrl)
        settings = response.json()

        if settings['waterPlant']:
            watering_duration = settings['wateringDuration']
            relay.turn_on_for(watering_duration)
            requests.post(wateringUrl, json={'waterPlant': False})
        if settings['captureInterval']:
            capture_interval = settings['captureInterval']
    except Exception as e:
        print("Chyba při načítání nastavení:", str(e))

def job_read_and_update_display():
    moist, humi, temp, light = readSensors()
    if None not in [moist, humi, temp, light]:
        display_data = "T:{}C H:{}%\nM:{}% L:{}".format(temp, humi, round(moist, 1), round(light, 1))
        display.setText_norefresh(display_data)
        if moist < 50:
            relay.turn_on_for(watering_duration)
    else:
        display.setText_norefresh("Chyba při čtení\nsenzorů")


def job_capture_and_send():
    moist, humi, temp, light = readSensors()
    if None not in [moist, humi, temp, light]:
        sensors = {
            "temperature": temp,
            "humidity": humi,
            "soilMoisture": moist,
            "light": light,
        }
        camera.capture_and_send_image(sensors)


def main():
    if not os.path.exists(img_path):
        os.makedirs(img_path)
    camera.setup_camera()
    display.clear()

    schedule.every(0.1).minutes.do(job_read_and_update_display)
    schedule.every(capture_interval).minutes.do(job_capture_and_send)
    schedule.every(1).minutes.do(fetch_and_apply_settings)

    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Program ukončen uživatelem")
    finally:
        if display:
            display.clear()
        if camera:
            camera.stop_camera()
        if relay.is_on():
            relay.turn_off()



if __name__ == '__main__':
    main()