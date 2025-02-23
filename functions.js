let mediaFiles = [
    { url: "media/image1.jpg", duration: 3000, mime: "image/jpeg" },
    { url: "media/image2.jpg", duration: 3000, mime: "image/jpeg" },
    { url: "media/video1.mp4", duration: 5000, mime: "video/mp4" },
    { url: "media/missing.jpg", duration: 3000, mime: "image/jpeg" } // Simulated missing file
];

let currentIndex = 0;

function displayMedia(url, duration, mime) {
    console.log("Attempting to load:", url);

    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = ''; // Clear previous content
    mediaContainer.style.display = 'block';

    const errorMessage = document.getElementById('error-message');
    if (errorMessage) errorMessage.style.display = 'none';

    let mediaElement;

    if (mime.startsWith("image")) {
        mediaElement = document.createElement("img");
        mediaElement.src = url;
        mediaElement.classList.add("media-content");
        mediaElement.onerror = () => handleMissingMedia(url);
        mediaContainer.appendChild(mediaElement);

        setTimeout(getNextMedia, duration);
    } 
    else if (mime.startsWith("video")) {
        mediaElement = document.createElement("video");
        mediaElement.src = url;
        mediaElement.classList.add("media-content");
        mediaElement.controls = false;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.loop = false;
        mediaElement.onerror = () => handleMissingMedia(url);

        mediaElement.onended = () => getNextMedia();
        mediaContainer.appendChild(mediaElement);
    } 
    else {
        errorHandler(`Unsupported media type: ${mime}`);
    }
}

function handleMissingMedia(url) {
    console.error(`Missing media detected: ${url}`);
    errorHandler(`Failed to load: ${url}`);
}

function errorHandler(message) {
    console.error("Error:", message);

    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = ''; // Clear previous media
    mediaContainer.style.display = 'none'; // Hide media container

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    // Skip to next media after 3 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
        mediaContainer.style.display = 'block';
        getNextMedia();
    }, 3000);
}

function getNextMedia() {
    let attempts = 0;

    do {
        currentIndex = (currentIndex + 1) % mediaFiles.length;
        let media = mediaFiles[currentIndex];

        if (media.url !== "media/missing.jpg") {
            displayMedia(media.url, media.duration, media.mime);
            return;
        }

        attempts++;

        // Prevent infinite loop if all files are missing
        if (attempts >= mediaFiles.length) {
            console.error("No valid media found, restarting from the beginning...");
            currentIndex = 0;
        }

    } while (attempts < mediaFiles.length);
}

// Start the loop
getNextMedia();
