from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import tensorflow as tf
import json
import sys

model = tf.keras.models.load_model('./model_bazalka_vahovany.h5')
tf.get_logger().setLevel('ERROR')

img_path = sys.argv[1]
img = load_img(img_path, color_mode='grayscale', target_size=(480, 270))
img_array = img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)

img_array /= 255.0

prediction = model.predict(img_array, verbose=None)[0]

class_names = ["healthy", "sick", "unhealthy"]
print(json.dumps({class_names[i]: round(float(prob * 100), 2) for i, prob in enumerate(prediction)}))


