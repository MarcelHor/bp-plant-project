import requests
from mimetypes import MimeTypes
from datetime import datetime
import time
url = 'http://localhost:3000/upload'
image_path = '92269810.jpeg'

sensors = {
    "temperature": 20,
    "humidity": 50,
    "soilMoisture": 30,
    "createdAt": datetime.now().isoformat()
}



mime = MimeTypes()
mime_type = mime.guess_type(image_path)[0]
files = {'image': (image_path, open(image_path, 'rb'), mime_type)}
response = requests.post(url, files=files, data=sensors)

if response.status_code == 200:
    print("Úspěšně odesláno")
else:
    print("Chyba při odesílání:", response.text)
