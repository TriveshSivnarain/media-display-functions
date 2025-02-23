let mediaFiles = [
    { url: "media/image1.jpg", duration: 3000, mime: "image/jpeg" },
    { url: "media/image2.jpg", duration: 3000, mime: "image/jpeg" },
    { url: "media/video1.mp4", duration: 5000, mime: "video/mp4" },
    { url: "media/missing.jpg", duration: 3000, mime: "image/jpeg" } // This will trigger an error
];
let currentIndex = 0;

function displayMedia(url, duration, mime) {
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = ''; // Clear previous content

    // Hide error message if previously shown
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    let mediaElement;

    if (mime.startsWith("image")) {
        mediaElement = document.createElement("img");
        mediaElement.src = url;
        mediaElement.classList.add("media-content");
    } else if (mime.startsWith("video")) {
        mediaElement = document.createElement("video");
        mediaElement.src = url;
        mediaElement.classList.add("media-content");
        mediaElement.controls = false;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.loop = false;
        mediaElement.onended = () => getNextMedia(); // Move to next media when video ends
    } else {
        errorHandler(`Unsupported media type: ${mime}`);
        return;
    }

    mediaElement.onerror = () => errorHandler(`Failed to load: ${url}`);
    mediaContainer.appendChild(mediaElement);

    if (!mime.startsWith("video")) {
        setTimeout(getNextMedia, duration);
    }
}

function errorHandler(message) {
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = ''; // Clear previous media
    mediaContainer.style.display = 'none';

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
        mediaContainer.style.display = 'block';
        getNextMedia();
    }, 3000);
}

function getNextMedia() {
    currentIndex = (currentIndex + 1) % mediaFiles.length;
    let media = mediaFiles[currentIndex];
    displayMedia(media.url, media.duration, media.mime);
}

// Start the loop
getNextMedia();
