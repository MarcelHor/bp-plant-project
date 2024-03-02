import requests
from mimetypes import MimeTypes
import json

username = 'marcel'
password = 'marcel'

login_url = 'http://localhost:3000/auth/login'
upload_url = 'http://localhost:3000/upload'
image_path = '92269810.jpeg'

login_data = {
    'username': username,
    'password': password
}

session = requests.Session()

login_response = session.post(login_url, data=json.dumps(login_data), headers={'Content-Type': 'application/json'})
print(login_response.text)
if login_response.status_code == 200:
    print("Úspěšně přihlášeno")
    sensors = {
        "temperature": 20,
        "humidity": 50,
        "soilMoisture": 30,
        'light': 100,
    }

    mime = MimeTypes()
    mime_type = mime.guess_type(image_path)[0]

    files = {'image': (image_path, open(image_path, 'rb'), mime_type)}

    response = session.post(upload_url, files=files, data=sensors)

    files['image'][1].close()

    if response.status_code == 200:
        print("Úspěšně odesláno")
    else:
        print("Chyba při odesílání:", response.text)
else:
    print("Chyba při přihlašování:", login_response.text)
