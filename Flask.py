from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import base64
import io

app = Flask(__name__)
model = load_model('path/to/your_model.h5')  # Load your model here

# Define the size expected by the model (e.g., 224x224 for some models)
width, height = 224, 224

# Dictionary mapping the disease prediction to its details
disease_info = {
    0: {
        "name": "Late Blight",
        "definition": "Late blight is a disease caused by the fungus-like organism Phytophthora infestans. It can cause significant damage to leaves and fruits.",
        "prevention": "To prevent late blight, apply fungicides, remove infected plants, and avoid overwatering the plants."
    },
    1: {
        "name": "Early Blight",
        "definition": "Early blight is caused by the fungus Alternaria solani and affects the plant’s leaves, stems, and fruits.",
        "prevention": "Use resistant varieties, rotate crops, and apply fungicides as needed."
    },
    2: {
        "name": "Tomato Mosaic Virus",
        "definition": "The Tomato Mosaic Virus causes mottling and discoloration of the leaves and stunts the plant's growth.",
        "prevention": "Plant resistant varieties, disinfect tools, and avoid handling plants when they are wet."
    },
    # Add more diseases as needed
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    image_data = data['image']

    # Process the image (assuming it's in base64)
    img_data = base64.b64decode(image_data.split(',')[1])  # Decode base64 image
    image = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)  # Convert to image
    image = cv2.resize(image, (width, height))  # Resize to the size your model expects
    image = np.expand_dims(image, axis=0)  # Add batch dimension

    # Make prediction
    prediction = model.predict(image)
    predicted_class = np.argmax(prediction, axis=1)[0]  # Get the class index

    # Get the disease information based on prediction
    disease = disease_info.get(predicted_class, {
        "name": "Unknown",
        "definition": "This disease is not recognized by the system.",
        "prevention": "No prevention available for unknown diseases."
    })

    return jsonify({
        'prediction': disease['name'],
        'definition': disease['definition'],
        'prevention': disease['prevention']
    })

if __name__ == '__main__':
    app.run(debug=True)
