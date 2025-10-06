// Global state
let currentStream = null;
let currentDeviceId = null;
let autoModeInterval = null;
let colorThief = null;

// DOM elements
const cameraSelect = document.getElementById('cameraSelect');
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const colorPreview = document.getElementById('colorPreview');
const colorValues = document.getElementById('colorValues');
const sendButton = document.getElementById('sendButton');
const autoButton = document.getElementById('autoButton');
const statusMessage = document.getElementById('statusMessage');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    colorThief = new ColorThief();
    initializeCameras();
    setupEventListeners();
});

// Camera Management
async function initializeCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
            showStatus('No cameras found. Please connect a camera.', true);
            return;
        }

        // Populate dropdown
        cameraSelect.innerHTML = '';
        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        // Select first camera by default
        if (videoDevices.length > 0) {
            await selectCamera(videoDevices[0].deviceId);
        }
    } catch (error) {
        showStatus('Error accessing cameras: ' + error.message, true);
    }
}

async function selectCamera(deviceId) {
    try {
        // Stop current stream if exists
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = currentStream;
        currentDeviceId = deviceId;

        // Start color detection once video is playing
        videoElement.addEventListener('playing', () => {
            console.log('Video is playing, starting color detection');
            startColorDetection();
        }, { once: true });

    } catch (error) {
        if (error.name === 'NotAllowedError') {
            showStatus('Camera access denied. Please allow camera access and refresh.', true);
        } else if (error.name === 'NotFoundError') {
            showStatus('Camera not found. Please check your camera connection.', true);
        } else {
            showStatus('Error accessing camera: ' + error.message, true);
        }
    }
}

// Handle camera stream drops
videoElement.addEventListener('ended', () => {
    showStatus('Camera disconnected. Attempting to reconnect...', true);
    setTimeout(() => {
        if (currentDeviceId) {
            selectCamera(currentDeviceId);
        }
    }, 2000);
});

// Camera selection change
cameraSelect.addEventListener('change', (e) => {
    selectCamera(e.target.value);
});

// Color Detection
let detectionRunning = false;
let lastDetectedColor = null;

function startColorDetection() {
    if (detectionRunning) {
        console.log('Color detection already running');
        return;
    }
    console.log('Starting color detection');
    detectionRunning = true;
    detectColorLoop();
}

function detectColorLoop() {
    if (!detectionRunning) return;

    try {
        // Check if video is ready and playing
        if (videoElement.readyState >= 2 && !videoElement.paused && !videoElement.ended) {
            // Color Thief requires the image to be complete
            if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                try {
                    const color = colorThief.getColor(videoElement);
                    if (color && Array.isArray(color) && color.length === 3) {
                        lastDetectedColor = { red: color[0], green: color[1], blue: color[2] };
                        updateColorPreview(lastDetectedColor);
                    }
                } catch (colorThiefError) {
                    // Fallback: use canvas to extract color
                    const color = getColorFromCanvas();
                    if (color) {
                        lastDetectedColor = color;
                        updateColorPreview(lastDetectedColor);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Color detection failed:', error);
        // Continue trying even if there's an error
    }

    requestAnimationFrame(detectColorLoop);
}

function getColorFromCanvas() {
    try {
        const canvas = canvasElement;
        const context = canvas.getContext('2d');
        
        // Set canvas size to match video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        // Draw current video frame
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Get pixel data from center of image
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const imageData = context.getImageData(centerX - 50, centerY - 50, 100, 100);
        
        // Calculate average color
        let r = 0, g = 0, b = 0;
        const pixels = imageData.data.length / 4;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            r += imageData.data[i];
            g += imageData.data[i + 1];
            b += imageData.data[i + 2];
        }
        
        return {
            red: Math.round(r / pixels),
            green: Math.round(g / pixels),
            blue: Math.round(b / pixels)
        };
    } catch (error) {
        console.error('Canvas color extraction failed:', error);
        return null;
    }
}

function updateColorPreview(rgb) {
    const { red, green, blue } = rgb;
    colorPreview.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    colorValues.textContent = `RGB: ${red}, ${green}, ${blue}`;
}

// Manual Color Sending
async function sendColorToBackend(rgb) {
    if (!rgb) {
        showStatus('No color detected yet', true);
        return;
    }

    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';

    try {
        const response = await fetch('/api/color', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rgb)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showStatus(data.message || 'Color sent successfully', false);
        } else {
            showStatus(data.message || 'Failed to set color', true);
        }
    } catch (error) {
        showStatus('Network error: ' + error.message, true);
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Send Color';
    }
}

function showStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + (isError ? 'error' : 'success');
    statusMessage.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// Automatic Color Synchronization
function startAutoMode() {
    if (autoModeInterval) return;

    autoModeInterval = setInterval(() => {
        if (lastDetectedColor) {
            sendColorToBackend(lastDetectedColor);
        }
    }, 3000);

    autoButton.classList.add('active');
    autoButton.textContent = 'Auto Mode (ON)';
    showStatus('Auto mode enabled - sending color every 3 seconds', false);
}

function stopAutoMode() {
    if (autoModeInterval) {
        clearInterval(autoModeInterval);
        autoModeInterval = null;
    }

    autoButton.classList.remove('active');
    autoButton.textContent = 'Auto Mode';
    showStatus('Auto mode disabled', false);
}

function toggleAutoMode() {
    if (autoModeInterval) {
        stopAutoMode();
    } else {
        startAutoMode();
    }
}

function setupEventListeners() {
    sendButton.addEventListener('click', () => {
        if (lastDetectedColor) {
            sendColorToBackend(lastDetectedColor);
        }
    });

    autoButton.addEventListener('click', toggleAutoMode);
}
