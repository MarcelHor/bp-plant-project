from apscheduler.schedulers.background import BackgroundScheduler
from camera import Camera
from sensors import GroveMoistureSensor, LightSensor
from display import Display
from rele import RelayControl
from datetime import datetime
import requests
from mimetypes import MimeTypes
import seeed_dht
import time
import os

scheduler = BackgroundScheduler()

api_key = ''
settingsUrl = 'https://bp.marcel-horvath.com/api/plant-settings'
wateringUrl = 'https://bp.marcel-horvath.com/api/plant-settings/watering'
url = 'https://bp.marcel-horvath.com/api/upload'
watering_duration = 2
capture_interval = 0.1

img_path = os.path.join(os.getcwd(), "images")

display = Display()
light_sensor = LightSensor(2)
sensor_moisture = GroveMoistureSensor(0)
dht = seeed_dht.DHT("11", 5)
relay = RelayControl(16)
camera = Camera(img_path, url, api_key)

def readSensors():
    try:
        moist = sensor_moisture.read()
        humi, temp = dht.read()
        light = light_sensor.read()
        return moist, humi, temp, light
    except Exception as e:
        print("Chyba při čtení senzorů:", str(e))
        return None, None, None, None


def fetch_and_apply_settings():
    global watering_duration, capture_interval
    headers = {'x-api-key': api_key}  
    try:
        response = requests.get(settingsUrl, headers=headers) 
        settings = response.json()

        if settings['waterPlant']:
            watering_duration = settings['wateringDuration']
            relay.turn_on_for(watering_duration)
            requests.post(wateringUrl, json={'waterPlant': False}, headers=headers)
        
        if settings['captureInterval']:
            if settings['captureInterval'] != capture_interval:
                capture_interval = settings['captureInterval']
                jobs = scheduler.get_jobs()
                for job in jobs:
                    if job.name == 'job_capture_and_send':
                        scheduler.remove_job(job.id)
                        scheduler.add_job(job_capture_and_send, 'interval', minutes=capture_interval)
    except Exception as e:
        print("Chyba při načítání nastavení:", str(e))


def job_capture_and_send():
    moist, humi, temp, light = readSensors()
    if None not in [moist, humi, temp, light]:
        sensors = {
            "temperature": temp,
            "humidity": humi,
            "soilMoisture": moist,
            "light": light,
        }
        file_path = camera.capture_image()
        if file_path:
            send_image(file_path, sensors)
        display_data = "T:{}C H:{}%\nM:{}% L:{}".format(temp, humi, round(moist, 1), round(light, 1))
        display.setText_norefresh(display_data)
        if moist < 50:
            relay.turn_on_for(watering_duration)
    else:
        print("Chyba při čtení senzorů")
        display.setText_norefresh("Chyba při čtení senzorů")


def send_image(file_path, sensors):
    try:
        mime = MimeTypes()
        mime_type = mime.guess_type(file_path)[0]
        with open(file_path, 'rb') as file:
            files = {'image': (os.path.basename(file_path), file, mime_type)}
            headers = {'x-api-key': api_key}
            response = requests.post(url, files=files, data=sensors, headers=headers)
            if response.status_code == 200:
                print("Úspěšně odesláno")
                os.remove(file_path)
            else:
                print("Chyba při odesílání:", response.text)
    except Exception as e:
        print("Chyba při odesílání dat nebo mazání souboru:", str(e))
        if os.path.exists(file_path):
            os.remove(file_path)



def main():
    if not os.path.exists(img_path):
        os.makedirs(img_path)
    camera.setup_camera()
    display.clear()

    scheduler.add_job(fetch_and_apply_settings, 'interval', seconds=38)
    scheduler.add_job(job_capture_and_send, 'interval', minutes=capture_interval)
    scheduler.start()

    try:
        while True:
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
        scheduler.shutdown()


if __name__ == '__main__':
    main()