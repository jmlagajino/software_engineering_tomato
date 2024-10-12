from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import base64

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load YOLOv8 model
model = YOLO("best.pt")

# Verify model class names (for debugging purposes)
print("Model class names:", model.names)

# Define a mapping from class ID to disease name
CLASS_ID_TO_NAME = {
    0: "Early Blight",
    1: "Powdery Mildew",
    2: "Anthracnose",
    3: "Tomato Spotted Wilt Virus",
    4: "Tomato Fruit Crack",
    5: "Botrytis Cinerea",
    6: "Blossom Drop",
    7: "Phytophthora Root Rot",
    8: "Southern Blight",
    9: "Catfacing",
}

@app.route('/test', methods=['GET'])
def test():
    return "Hello, world!"

@app.route('/detect', methods=['POST'])
def detect():
    # Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Read the image file from the request
    file = request.files['image']
    try:
        image = Image.open(file.stream)
    except Exception as e:
        return jsonify({'error': f'Invalid image format: {str(e)}'}), 400

    # Perform object detection using YOLOv8 with confidence threshold
    results = model(image, conf=0.25)  # Adjust confidence threshold as needed

    # Check if any detections were made
    if len(results[0].boxes.data) == 0:
        return jsonify({'detections': [], 'message': 'No diseases detected'})

    # Convert detection results to a JSON serializable format
    detections = []
    for result in results[0].boxes.data:
        class_id = int(result[5].item())
        detections.append({
            'class': class_id,  # Class ID
            'name': CLASS_ID_TO_NAME.get(class_id, "Unknown"),  # Disease name
            'confidence': float(result[4].item()),  # Confidence score
            'box': [float(coord) for coord in result[:4].tolist()]  # Bounding box
        })

    # Convert the image to a base64 string for visualization
    output_image_stream = io.BytesIO()
    image.save(output_image_stream, format='PNG')
    output_image_stream.seek(0)
    image_base64 = base64.b64encode(output_image_stream.getvalue()).decode('utf-8')

    # Return the detection results along with the image as base64
    return jsonify({
        'detections': detections,
        'image_url': 'data:image/png;base64,' + image_base64
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)