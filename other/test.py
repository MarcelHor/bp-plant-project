import requests
from mimetypes import MimeTypes

api_key = '7125a322-3e95-4cb8-ab1e-392858e7f53a'
upload_url = 'https://marcel-horvath.com/api/upload'
image_path = 'image-fff7804c-a642-4a66-8bd8-aac7e68eace5-1701348153665.jpeg'

sensors = {
    "temperature": 20,
    "humidity": 50,
    "soilMoisture": 30,
    'light': 100,
}

mime = MimeTypes()
mime_type = mime.guess_type(image_path)[0]

# Otevření souboru v binárním módu
with open(image_path, 'rb') as file:
    files = {'image': (image_path, file, mime_type)}

    # Definování hlavičky pro API klíč, ale ponechání 'Content-Type' na automatické nastavení knihovnou 'requests'
    headers = {
        'x-api-key': api_key,
    }

    response = requests.post(upload_url, files=files, data=sensors, headers=headers)

if response.status_code == 200:
    print("Úspěšně odesláno")
else:
    print("Chyba při odesílání:", response.text)