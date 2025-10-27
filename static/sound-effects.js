// Sound effects for enhanced user experience
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;
        
        this.initAudioContext();
        this.createSounds();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    createTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode };
    }
    
    createSounds() {\n        // Success sound\n        this.sounds.success = () => {\n            this.createTone(523.25, 0.2); // C5\n            setTimeout(() => this.createTone(659.25, 0.2), 100); // E5\n            setTimeout(() => this.createTone(783.99, 0.3), 200); // G5\n        };\n        \n        // Error sound\n        this.sounds.error = () => {\n            this.createTone(220, 0.1, 'sawtooth');\n            setTimeout(() => this.createTone(196, 0.2, 'sawtooth'), 100);\n        };\n        \n        // Click sound\n        this.sounds.click = () => {\n            this.createTone(800, 0.1, 'square');\n        };\n        \n        // Insert sound\n        this.sounds.insert = () => {\n            this.createTone(440, 0.15);\n            setTimeout(() => this.createTone(554.37, 0.1), 50);\n        };\n        \n        // Delete sound\n        this.sounds.delete = () => {\n            this.createTone(554.37, 0.1);\n            setTimeout(() => this.createTone(440, 0.15), 50);\n        };\n        \n        // Achievement sound\n        this.sounds.achievement = () => {\n            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6\n            notes.forEach((note, i) => {\n                setTimeout(() => this.createTone(note, 0.2), i * 100);\n            });\n        };\n        \n        // Quiz correct\n        this.sounds.correct = () => {\n            this.createTone(659.25, 0.2); // E5\n            setTimeout(() => this.createTone(783.99, 0.3), 100); // G5\n        };\n        \n        // Quiz incorrect\n        this.sounds.incorrect = () => {\n            this.createTone(311.13, 0.3, 'sawtooth'); // Eb4\n        };\n    }\n    \n    play(soundName) {\n        if (this.enabled && this.sounds[soundName]) {\n            // Resume audio context if suspended (required by some browsers)\n            if (this.audioContext.state === 'suspended') {\n                this.audioContext.resume();\n            }\n            this.sounds[soundName]();\n        }\n    }\n    \n    toggle() {\n        this.enabled = !this.enabled;\n        return this.enabled;\n    }\n    \n    setVolume(volume) {\n        this.volume = Math.max(0, Math.min(1, volume));\n    }\n}\n\n// Create global sound manager\nconst soundManager = new SoundManager();\n\n// Add sound toggle button to navbar\ndocument.addEventListener('DOMContentLoaded', () => {\n    const navStats = document.querySelector('.nav-stats');\n    if (navStats) {\n        const soundToggle = document.createElement('button');\n        soundToggle.innerHTML = '<i class=\"fas fa-volume-up\"></i>';\n        soundToggle.style.cssText = `\n            background: transparent;\n            border: 1px solid rgba(255,255,255,0.3);\n            color: white;\n            padding: 0.5rem;\n            border-radius: 6px;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        `;\n        \n        soundToggle.addEventListener('click', () => {\n            const enabled = soundManager.toggle();\n            soundToggle.innerHTML = enabled ? \n                '<i class=\"fas fa-volume-up\"></i>' : \n                '<i class=\"fas fa-volume-mute\"></i>';\n            soundToggle.style.opacity = enabled ? '1' : '0.5';\n            soundManager.play('click');\n        });\n        \n        navStats.appendChild(soundToggle);\n    }\n});\n\n// Export for use in other scripts\nwindow.soundManager = soundManager;"}