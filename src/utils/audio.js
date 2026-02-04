// Sound utility functions using Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let isMutedGlobal = true;

const initAudio = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
};

export const playSound = (frequency, duration, type = 'sine', volume = 0.1) => {
    if (isMutedGlobal) return;
    const ctx = initAudio();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

export const setMuted = (muted) => {
    isMutedGlobal = muted;
    localStorage.setItem('isMuted', muted);
};

export const getMuted = () => isMutedGlobal;

// Different sound effects
export const sounds = {
    hover: () => {
        // Soft shimmering shimmer
        playSound(440, 0.2, 'triangle', 0.02);
        setTimeout(() => playSound(880, 0.1, 'sine', 0.01), 20);
    },
    click: () => {
        // Melodic tap
        playSound(330, 0.15, 'triangle', 0.04);
        setTimeout(() => playSound(660, 0.1, 'triangle', 0.02), 50);
    },
    menuOpen: () => {
        // Upward crystalline sequence
        [261.63, 329.63, 392.00].forEach((freq, i) => {
            setTimeout(() => playSound(freq, 0.2, 'triangle', 0.03 - i * 0.01), i * 60);
        });
    },
    menuClose: () => {
        // Downward soft sequence
        [392.00, 329.63, 261.63].forEach((freq, i) => {
            setTimeout(() => playSound(freq, 0.2, 'triangle', 0.03 - i * 0.01), i * 60);
        });
    },
    bubble: () => {
        if (isMutedGlobal) return;
        // Sweet, resonant bubble "drip"
        const baseFreq = 220 + Math.random() * 110;
        playSound(baseFreq, 0.4, 'triangle', 0.02);
        setTimeout(() => {
            if (isMutedGlobal) return;
            playSound(baseFreq * 2, 0.2, 'sine', 0.01);
        }, 30);
    }
};
