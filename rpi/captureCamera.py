from picamera2 import Picamera2
import time
import os
from datetime import datetime
def setup_camera():
    picam2 = Picamera2()
    picam2.set_logging(Picamera2.ERROR)
    camera_config = picam2.create_still_configuration(main={"size": (1920, 1080)}, lores={"size": (640, 480)},
                                                      display="lores")
    picam2.configure(camera_config)
    time.sleep(2)
    return picam2

def capture_timelapse(camera, img_path, num_photos=360, interval=10):
    for i in range(num_photos):
        current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = os.path.join(img_path, f"timelapse_{current_time}.jpg")
        camera.capture_file(filename)
        time.sleep(interval)

def main():
    img_path = os.path.join(os.getcwd(), "images")

    if not os.path.exists(img_path):
        os.makedirs(img_path)

    camera = setup_camera()
    camera.start()
    capture_timelapse(camera, img_path)
    camera.stop()

if __name__ == "__main__":
    main()
