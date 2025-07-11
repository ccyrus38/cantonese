document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Player Logic ---
    let audioPlayer = null;

    function playAudio(audioSrc) {
        if (!audioPlayer) {
            audioPlayer = new Audio();
        }
        if (!audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        audioPlayer.src = audioSrc;
        audioPlayer.play().catch(error => {
            console.error("Audio playback error:", error);
        });
    }

    // --- Menu Logic ---
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    let hasDragged = false;

    fabButton.addEventListener('click', (event) => {
        if (hasDragged) {
            event.preventDefault();
            return;
        }
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

    // --- Draggable Button Logic ---
    let isDragging = false;
    let offsetX, offsetY;

    function onDragStart(event) {
        isDragging = true;
        hasDragged = false;
        const rect = fabButton.getBoundingClientRect();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        fabButton.style.transition = 'none'; // Disable transition during drag
    }

    function onDrag(event) {
        if (!isDragging) return;
        event.preventDefault(); // Prevent scrolling on mobile
        hasDragged = true;

        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        // Boundary checks
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const buttonW = fabButton.offsetWidth;
        const buttonH = fabButton.offsetHeight;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft > screenW - buttonW) newLeft = screenW - buttonW;
        if (newTop > screenH - buttonH) newTop = screenH - buttonH;

        fabButton.style.left = `${newLeft}px`;
        fabButton.style.top = `${newTop}px`;
        fabButton.style.right = 'auto';
        fabButton.style.bottom = 'auto';
    }

    function onDragEnd() {
        isDragging = false;
        fabButton.style.transition = 'transform .2s ease-in-out, opacity .3s'; // Re-enable transition
        // Reset hasDragged after a short delay to prevent click event
        setTimeout(() => { hasDragged = false; }, 0);
    }

    fabButton.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);

    fabButton.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', onDragEnd);

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
