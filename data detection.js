data.detections.forEach(detection => {
                    const boxDiv = document.createElement('div');
                    boxDiv.className = 'box';
                    boxDiv.style.left = `${detection.box[0]}px`;
                    boxDiv.style.top = `${detection.box[1]}px`;
                    boxDiv.style.width = `${detection.box[2] - detection.box[0]}px`;
                    boxDiv.style.height = `${detection.box[3] - detection.box[1]}px`;

                    // Extract the properties
                    const detectionDetails = `
                        <p><strong>Class ID:</strong> ${detection.class}</p>
                        <p><strong>Confidence:</strong> ${detection.confidence}</p>
                        <p><strong>Name:</strong> ${detection.name}</p>
                    `;

                    const detailsDiv = document.createElement('div');
                    detailsDiv.className = 'detection-details';
                    detailsDiv.innerHTML = detectionDetails;

                    boxDiv.appendChild(detailsDiv);

                    resultContainer.appendChild(boxDiv);
                });
