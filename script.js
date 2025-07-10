document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Player Logic ---
    let audioPlayer = null; // Create a single, reusable audio player

    function playAudio(audioSrc) {
        if (!audioPlayer) {
            audioPlayer = new Audio();
        }
        
        // Stop any currently playing audio
        if (!audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }

        audioPlayer.src = audioSrc;
        audioPlayer.play().catch(error => {
            console.error("Audio playback error:", error);
            // This might happen if user hasn't interacted with the page yet.
            // Modern browsers block autoplay until a user clicks/taps.
        });
    }

    // --- Menu Logic ---
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');

    if (fabButton && fabMenu) {
        fabButton.addEventListener('click', (event) => {
            event.stopPropagation();
            fabMenu.classList.toggle('active');
        });

        window.addEventListener('click', () => {
            if (fabMenu.classList.contains('active')) {
                fabMenu.classList.remove('active');
            }
        });

        fabMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // --- Global Event Handler for Audio Icons ---
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.audio-icon')) {
            const audioSrc = event.target.getAttribute('data-audio-src');
            if (audioSrc) {
                playAudio(audioSrc);
            }
        }
    });
});
