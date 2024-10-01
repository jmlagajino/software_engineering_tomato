const captureButton = document.getElementById('captureButton');
const uploadImage = document.getElementById('uploadImage');
const capturedImage = document.getElementById('capturedImage');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const capturePreview = document.querySelector('.capture-preview');
const imageForm = document.getElementById('imageForm');
const imageDataInput = document.getElementById('imageData');
const predictionStatus = document.getElementById('predictionStatus');
const predictionResult = document.getElementById('predictionResult');
const predictAnotherButton = document.getElementById('predictAnother');

// Function to start the video stream
function startVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream; 
            video.play(); 
        })
        .catch((err) => {
            console.error("Error accessing camera: " + err);
        });
}

// Show the capture preview when the capture button is clicked
captureButton.addEventListener('click', () => {
    capturePreview.style.display = 'block'; 
    startVideoStream(); 
});

// Capture the photo
snapButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); 
    const imageData = canvas.toDataURL('image/png'); 
    capturedImage.src = imageData; 
    capturedImage.style.display = 'block'; 
    imageDataInput.value = imageData; 
    imageForm.style.display = 'block';

    // Automatically submit the form after capturing the image
    setTimeout(() => {
        imageForm.requestSubmit(); 
    }, 1000); 
});

// Event listener for the upload image input
uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedData = e.target.result;
            capturedImage.src = uploadedData; 
            capturedImage.style.display = 'block'; 
            imageDataInput.value = uploadedData; 
            imageForm.style.display = 'block'; 

            // Automatically submit the form after uploading the image
            setTimeout(() => {
                imageForm.requestSubmit(); 
            }, 1000); 
        };
        reader.readAsDataURL(file); 
    }
});

// Handle form submission
imageForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    showPredictionStatus();

    const imageData = imageDataInput.value; 
    // Add a delay before sending the request to simulate loading effect
    setTimeout(() => {
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(result => {
            // Show the prediction result
            showPredictionResult(result.prediction);
        })
        .catch(error => {
            console.error('Error:', error); 
            alert('An error occurred while predicting the disease.');
        });
    }, 3000); 
});


// Show prediction status
function showPredictionStatus() {
    predictionResult.style.display = 'none';
    predictionStatus.style.display = 'block';
}

// Show prediction result
function showPredictionResult(predictedText) {
    predictionStatus.style.display = 'none';
    document.getElementById("predictedDisease").innerText = predictedText;
    predictionResult.style.display = 'block';
}

// Add event listener for the "Predict Another" button
predictAnotherButton.addEventListener("click", function () {
    predictionResult.style.display = 'none';
    capturePreview.style.display = 'none';
    capturedImage.style.display = 'none';
    imageForm.style.display = 'none';
});

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    const mainContent = document.querySelector('.main-content');
    const infoBox = document.querySelector('.info-box');

    // Trigger animations after a slight delay
    setTimeout(() => {
        h1.style.opacity = 1;
    }, 100); 

    setTimeout(() => {
        mainContent.style.opacity = 1; 
    }, 300);

    setTimeout(() => {
        infoBox.style.opacity = 1; 
    }, 1200); 
});
