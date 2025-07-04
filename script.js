document.addEventListener('DOMContentLoaded', () => {
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    const synth = window.speechSynthesis;
    let cantoneseVoice = null;
    let voicesLoaded = false;

    function loadVoices() {
        const voices = synth.getVoices();
        if (voices.length > 0) {
            cantoneseVoice = voices.find(v => v.lang === 'zh-HK') ||
                             voices.find(v => v.lang === 'zh-Hant-HK') ||
                             voices.find(v => v.name.includes('Cantonese')) ||
                             voices.find(v => v.lang.startsWith('zh-Hant'));
            voicesLoaded = true;
            console.log(cantoneseVoice ? `Cantonese voice loaded: ${cantoneseVoice.name}` : "Cantonese voice not found, will use lang code.");
        }
    }

    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }
    loadVoices();

    function speak(text) {
        if (!synth) {
            alert('抱歉，你的瀏覽器唔支援語音功能。');
            return;
        }

        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        if (cantoneseVoice) {
            utterance.voice = cantoneseVoice;
        } else {
            utterance.lang = 'zh-HK';
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        synth.speak(utterance);
    }
    
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

    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.audio-icon')) {
            // This is the user gesture that "unlocks" speech synthesis on mobile
            if (synth.paused) {
                synth.resume();
            }
            
            const textToSpeak = event.target.getAttribute('data-text');
            if (textToSpeak) {
                speak(textToSpeak);
            }
        }
    });
});
