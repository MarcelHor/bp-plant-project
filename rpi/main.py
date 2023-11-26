from camera import Camera
from sensors import GroveMoistureSensor, LightSensor
from display import Display
from datetime import datetime
import seeed_dht
import schedule
import time
import os

# Inicializace senzorů a LED baru
display = Display()
light_sensor = LightSensor(2)
sensor_moisture = GroveMoistureSensor(0)
dht = seeed_dht.DHT("11", 5)
img_path = os.path.join(os.getcwd(), "images")
url = 'http://192.168.137.1:3000/upload'
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


def job_read_and_update_display():
    moist, humi, temp, light = readSensors()
    if None not in [moist, humi, temp, light]:
        display_data = "T:{}C H:{}%\nM:{}% L:{}".format(temp, humi, round(moist, 1), round(light, 1))
        display.setText_norefresh(display_data)
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
    schedule.every(1).minutes.do(job_capture_and_send)

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


if __name__ == '__main__':
    main()