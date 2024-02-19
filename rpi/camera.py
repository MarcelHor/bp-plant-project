import os
import time
from datetime import datetime
from picamera2 import Picamera2
import requests
from mimetypes import MimeTypes


class Camera:
    def __init__(self, img_path, upload_url, light_threshold=10):
        self.light_threshold = light_threshold
        self.img_path = img_path
        self.upload_url = upload_url
        self.camera = None

    def setup_camera(self):
        try:
            self.camera = Picamera2()
            self.camera.set_logging(Picamera2.ERROR)
            camera_config = self.camera.create_still_configuration(main={"size": (1920, 1080)},
                                                                   lores={"size": (640, 480)}, display="lores")
            self.camera.configure(camera_config)
            self.camera.set_controls({"AfMode": 0, "LensPosition": 5})
            time.sleep(2)
            self.camera.start()
        except Exception as e:
            print("Chyba při nastavování kamery:", str(e))

    def stop_camera(self):
        self.camera.stop()

    def capture_and_send_image(self, sensors):
        file_path = None
        try:
            if sensors["light"] < self.light_threshold:
                print("Příliš tmavé na pořízení snímku")
                return
            current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"image_{current_time}.jpg"
            file_path = os.path.join(self.img_path, filename)
            self.camera.capture_file(file_path)

            mime = MimeTypes()
            mime_type = mime.guess_type(file_path)[0]
            with open(file_path, 'rb') as file:
                files = {'image': (filename, file, mime_type)}
                response = requests.post(self.upload_url, files=files, data=sensors)

            if response.status_code == 200:
                print("Úspěšně odesláno")
                os.remove(file_path)
            else:
                print("Chyba při odesílání:", response.text)
        except Exception as e:
            print("Chyba při odesílání dat nebo mazání souboru:", str(e))
        finally:
            if file_path is not None and os.path.exists(file_path):
                os.remove(file_path)