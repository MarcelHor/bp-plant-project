from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import tensorflow as tf
import json
import sys

model = tf.keras.models.load_model('./plantDetection/sicknessDetection.h5')
tf.get_logger().setLevel('ERROR')

img_path = sys.argv[1]
img = load_img(img_path, target_size=(200, 200))
img_array = img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0

prediction = model.predict(img_array, verbose=None)[0]

labels = [
    "apple scab", "apple black rot", "apple cedar rust", "apple healthy",
    "blueberry healthy", "cherry (including sour) powdery mildew",
    "cherry (including sour) healthy", "corn (maize) cercospora leaf spot gray leaf spot",
    "corn (maize) common rust", "corn (maize) northern leaf blight", "corn (maize) healthy",
    "grape black rot", "grape esca (black measles)", "grape leaf blight (isariopsis leaf spot)",
    "grape healthy", "orange haunglongbing (citrus greening)",
    "peach bacterial spot", "peach healthy", "pepper bell bacterial spot",
    "pepper bell healthy", "potato early blight", "potato late blight",
    "potato healthy", "raspberry healthy", "soybean healthy",
    "squash powdery mildew", "strawberry leaf scorch", "strawberry healthy",
    "tomato bacterial spot", "tomato early blight", "tomato late blight",
    "tomato leaf mold", "tomato septoria leaf spot",
    "tomato spider mites two spotted spider mite", "tomato target spot",
    "tomato yellow leaf curl virus", "tomato mosaic virus", "tomato healthy",
    "background"
]

print(json.dumps({labels[i]: round(float(prob * 100), 2) for i, prob in enumerate(prediction)}))

