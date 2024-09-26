const captureButton = document.getElementById('captureButton');
const uploadImage = document.getElementById('uploadImage');
const capturedImage = document.getElementById('capturedImage');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const capturePreview = document.querySelector('.capture-preview');
const imageForm = document.getElementById('imageForm');
const imageDataInput = document.getElementById('imageData');

// Function to start the video stream
function startVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream; // Link the stream to the video element
            video.play(); // Start playing the video
        })
        .catch((err) => {
            console.error("Error accessing camera: " + err);
        });
}

// Show the capture preview when the capture button is clicked
captureButton.addEventListener('click', () => {
    capturePreview.style.display = 'block'; // Show the video stream container
    startVideoStream(); // Start the video stream
});

// Capture the photo
snapButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the video frame to the canvas
    const imageData = canvas.toDataURL('image/png'); // Get image data from the canvas
    capturedImage.src = imageData; // Set the captured image source
    capturedImage.style.display = 'block'; // Show the captured image
    imageDataInput.value = imageData; // Store the image data in the hidden input field for form submission
    imageForm.style.display = 'block'; // Show the form to submit the image
});

// Event listener for the upload image input
uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedData = e.target.result;
            capturedImage.src = uploadedData; // Set uploaded image source
            capturedImage.style.display = 'block'; // Show the uploaded image
            imageDataInput.value = uploadedData; // Store the uploaded image data for form submission
            imageForm.style.display = 'block'; // Show the form to submit the image
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// Handle form submission
imageForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const imageData = imageDataInput.value; // Get the image data

    // Send the image data to the backend using fetch
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData }) // Send the image data
    })
    .then(response => response.json())
    .then(result => {
        alert('Prediction: ' + result.prediction); // Show prediction result
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors
    });
});

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    const mainContent = document.querySelector('.main-content');
    const infoBox = document.querySelector('.info-box');

    // Trigger animations after a slight delay
    setTimeout(() => {
        h1.style.opacity = 1; // Make the heading visible
    }, 100); // Short delay for h1

    setTimeout(() => {
        mainContent.style.opacity = 1; // Make main content visible
    }, 300); // Delay for main content

    setTimeout(() => {
        infoBox.style.opacity = 1; // Make info box visible
    }, 1200); // Delay for info box
});
