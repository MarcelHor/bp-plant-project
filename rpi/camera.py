import os
import time
from datetime import datetime
from picamera2 import Picamera2

class Camera:
    def __init__(self, img_path, light_threshold=10):
        self.light_threshold = light_threshold
        self.img_path = img_path
        self.camera = None

    def setup_camera(self):
        try:
            self.camera = Picamera2()
            camera_config = self.camera.create_still_configuration(main={"size": (1920, 1080)}, lores={"size": (640, 480)}, display="lores")
            self.camera.configure(camera_config)
            self.camera.set_controls({"AfMode": 0, "LensPosition": 3})
            time.sleep(2)
            self.camera.start()
        except Exception as e:
            print("Chyba při nastavování kamery:", str(e))

    def stop_camera(self):
        self.camera.stop()

    def capture_image(self):
        if self.camera:
            current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            filename = f"image_{current_time}.jpg"
            file_path = os.path.join(self.img_path, filename)
            self.camera.capture_file(file_path)
            return file_path
        return None
