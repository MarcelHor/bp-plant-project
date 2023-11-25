from sensors import GroveMoistureSensor, LightSensor
from display import Display
from picamera2 import Picamera2
import seeed_dht
import schedule
import time
import os
import requests
from datetime import datetime
from mimetypes import MimeTypes

# Inicializace senzorů a LED baru
display = Display()
light_sensor = LightSensor(2)
sensor_moisture = GroveMoistureSensor(0)
dht = seeed_dht.DHT("11", 5)
url = 'http://192.168.137.1:3000/upload'

def readSensors():
    try:
        moist = sensor_moisture.read()
        humi, temp = dht.read()
        light = light_sensor.read()
        return moist, humi, temp, light
    except Exception as e:
        print("Chyba při čtení senzorů:", str(e))
        return None

def setup_camera():
    try:
        picam2 = Picamera2()
        picam2.set_logging(Picamera2.ERROR)
        camera_config = picam2.create_still_configuration(main={"size": (1920, 1080)}, lores={"size": (640, 480)}, display="lores")
        picam2.configure(camera_config)
        time.sleep(2)
        return picam2
    except Exception as e:
        print("Chyba při nastavování kamery:", str(e))
        return None

def capture_and_send_image(camera, img_path, sensors):
    try:
        current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"image_{current_time}.jpg"
        file_path = os.path.join(img_path, filename)
        camera.capture_file(file_path)

        mime = MimeTypes()
        mime_type = mime.guess_type(file_path)[0]
        with open(file_path, 'rb') as file:
            files = {'image': (filename, file, mime_type)}
            response = requests.post(url, files=files, data=sensors)

        if response.status_code == 200:
            print("Úspěšně odesláno")
            # Smazání obrázku po úspěšném odeslání
            os.remove(file_path)
        else:
            print("Chyba při odesílání:", response.text)
    except Exception as e:
        print("Chyba při odesílání dat nebo mazání souboru:", str(e))

def job_read_and_update_led():
    vlhkost, humi, temp, light = readSensors()
    if vlhkost is not None:
            display_data = "T:{}C H:{}%\nM:{}% L:{}".format(temp, humi, round(vlhkost, 1), round(light,1))
            display.setText_norefresh(display_data)
            print(display_data)

def job_capture_and_send(camera, img_path):
    vlhkost, humi, temp = readSensors()
    if None not in [vlhkost, humi, temp]:
        sensors = {
            "temperature": temp,
            "humidity": humi,
            "soilMoisture": vlhkost,
            "createdAt": datetime.now().isoformat()
        }
        capture_and_send_image(camera, img_path, sensors)

def main():
    img_path = os.path.join(os.getcwd(), "images")
    if not os.path.exists(img_path):
        os.makedirs(img_path)

    camera = setup_camera()
    if camera is None:
        return

    camera.start()

    display.clear()

    # Plánování úloh
    schedule.every(0.1).minutes.do(job_read_and_update_led)
    schedule.every(1).minutes.do(job_capture_and_send, camera, img_path)
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Program ukončen uživatelem")
    finally:
        if ledbar:
            ledbar.level(0)
        if camera:
            camera.stop()

if __name__ == '__main__':
    main()