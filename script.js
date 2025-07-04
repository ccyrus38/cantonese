document.addEventListener('DOMContentLoaded', () => {
    // --- Speech Synthesis Logic (Robust Version) ---
    const synth = window.speechSynthesis;
    let cantoneseVoice = null;
    let voiceIsReady = false;

    function loadVoices() {
        let voices = synth.getVoices();
        if (voices.length > 0) {
            cantoneseVoice = voices.find(v => v.lang === 'zh-HK') ||
                             voices.find(v => v.lang === 'zh-Hant-HK') ||
                             voices.find(v => v.name.includes('Cantonese')) ||
                             voices.find(v => v.lang.startsWith('zh-Hant'));
            
            if (cantoneseVoice) {
                console.log('Cantonese voice successfully loaded:', cantoneseVoice.name);
                voiceIsReady = true;
            } else {
                console.warn('No specific Cantonese voice found. Browser default will be used.');
                voiceIsReady = true; // Still ready to try with default
            }
        }
    }

    // Load voices initially
    loadVoices();
    // The onvoiceschanged event is crucial for some browsers
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // The main function to speak text
    function speak(text) {
        if (!voiceIsReady) {
            // If voices are not ready, try one last time.
            loadVoices();
            if (!voiceIsReady) {
                alert('抱歉，語音引擎仲未準備好，請刷新頁面再試一次。');
                return;
            }
        }
        
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            console.log('Finished speaking.');
        };
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };
        
        if (cantoneseVoice) {
            utterance.voice = cantoneseVoice;
        } else {
            // Fallback to language code if no voice object found
            utterance.lang = 'zh-HK';
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        synth.speak(utterance);
    }

    // --- Menu Logic ---
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');

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

    // --- Global Event Handler for Audio ---
    document.body.addEventListener('click', (event) => {
        // First user interaction can help initialize the speech engine
        if (synth && synth.paused) {
             synth.resume();
        }

        if (event.target.matches('.audio-icon')) {
            const textToSpeak = event.target.getAttribute('data-text');
            if (textToSpeak) {
                speak(textToSpeak);
            }
        }
    });
});