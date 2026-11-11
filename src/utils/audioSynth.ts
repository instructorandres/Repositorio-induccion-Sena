/**
 * Procedural Audio Synthesizer for SENA Institutional Anthem and Interactive Audio Cues
 * Uses standard Web Audio API - no external network calls needed.
 */

class SenaAudioController {
  private ctx: AudioContext | null = null;
  private isPlayingAnthem = false;
  private anthemTimeoutIds: number[] = [];
  private onNoteCallback: ((verseIndex: number, noteName: string) => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.15) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked by user gesture policy
    }
  }

  playSuccessChime() {
    this.playTone(523.25, 0.15, 'triangle', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.2), 120); // E5
    setTimeout(() => this.playTone(783.99, 0.35, 'triangle', 0.25), 240); // G5
  }

  playErrorChime() {
    this.playTone(349.23, 0.18, 'sawtooth', 0.15); // F4
    setTimeout(() => this.playTone(311.13, 0.3, 'sawtooth', 0.18), 160); // Eb4
  }

  playBadgeUnlock() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.2), idx * 100);
    });
  }

  /**
   * Plays the triumphant fanfare and harmonic melody of the SENA Anthem chorus:
   * "Estudiantes del SENA adelante, por Colombia luchad con amor..."
   */
  startAnthem(onProgress?: (verseIndex: number, noteName: string) => void) {
    this.stopAnthem();
    this.initContext();
    this.isPlayingAnthem = true;
    this.onNoteCallback = onProgress || null;

    // Standard musical notes (Frequencies in Hz)
    // C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25
    const anthemMelody = [
      // Fanfare intro
      { note: 'G4', freq: 392.00, dur: 0.35, delay: 0, verse: 0 },
      { note: 'C5', freq: 523.25, dur: 0.5, delay: 400, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.4, delay: 900, verse: 0 },
      { note: 'G5', freq: 783.99, dur: 0.7, delay: 1350, verse: 0 },

      // "Estudiantes del SENA adelante..."
      { note: 'G5', freq: 783.99, dur: 0.4, delay: 2200, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.3, delay: 2650, verse: 0 },
      { note: 'C5', freq: 523.25, dur: 0.4, delay: 3000, verse: 0 },
      { note: 'D5', freq: 587.33, dur: 0.3, delay: 3450, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.6, delay: 3800, verse: 0 },

      // "Por Colombia luchad con amor..."
      { note: 'F5', freq: 698.46, dur: 0.35, delay: 4500, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.3, delay: 4900, verse: 0 },
      { note: 'D5', freq: 587.33, dur: 0.3, delay: 5250, verse: 0 },
      { note: 'C5', freq: 523.25, dur: 0.8, delay: 5600, verse: 0 },

      // "Con el ánimo noble y constante..."
      { note: 'G4', freq: 392.00, dur: 0.35, delay: 6600, verse: 0 },
      { note: 'C5', freq: 523.25, dur: 0.4, delay: 7000, verse: 0 },
      { note: 'D5', freq: 587.33, dur: 0.3, delay: 7450, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.5, delay: 7800, verse: 0 },
      { note: 'G5', freq: 783.99, dur: 0.6, delay: 8350, verse: 0 },

      // "Sembraremos la paz y el honor."
      { note: 'F5', freq: 698.46, dur: 0.4, delay: 9100, verse: 0 },
      { note: 'E5', freq: 659.25, dur: 0.35, delay: 9550, verse: 0 },
      { note: 'D5', freq: 587.33, dur: 0.4, delay: 9950, verse: 0 },
      { note: 'C5', freq: 523.25, dur: 1.2, delay: 10400, verse: 0 },

      // Estrofa I: "En la forja del SENA se aprende..."
      { note: 'C5', freq: 523.25, dur: 0.4, delay: 12000, verse: 1 },
      { note: 'B4', freq: 493.88, dur: 0.35, delay: 12450, verse: 1 },
      { note: 'A4', freq: 440.00, dur: 0.4, delay: 12850, verse: 1 },
      { note: 'G4', freq: 392.00, dur: 0.5, delay: 13300, verse: 1 },
      { note: 'C5', freq: 523.25, dur: 0.8, delay: 13850, verse: 1 },

      // "Con trabajo, constancia y valor..."
      { note: 'E5', freq: 659.25, dur: 0.4, delay: 14800, verse: 1 },
      { note: 'D5', freq: 587.33, dur: 0.35, delay: 15250, verse: 1 },
      { note: 'C5', freq: 523.25, dur: 0.7, delay: 15650, verse: 1 },

      // "A labrar el futuro más noble..."
      { note: 'A4', freq: 440.00, dur: 0.4, delay: 16500, verse: 1 },
      { note: 'B4', freq: 493.88, dur: 0.35, delay: 16950, verse: 1 },
      { note: 'C5', freq: 523.25, dur: 0.45, delay: 17350, verse: 1 },
      { note: 'D5', freq: 587.33, dur: 0.5, delay: 17850, verse: 1 },

      // "De una patria que pide el honor!"
      { note: 'E5', freq: 659.25, dur: 0.4, delay: 18500, verse: 1 },
      { note: 'D5', freq: 587.33, dur: 0.35, delay: 18950, verse: 1 },
      { note: 'C5', freq: 523.25, dur: 1.4, delay: 19350, verse: 1 },
    ];

    anthemMelody.forEach(({ note, freq, dur, delay, verse }) => {
      const id = window.setTimeout(() => {
        if (!this.isPlayingAnthem) return;
        this.playTone(freq, dur, 'triangle', 0.22);
        // Harmonic brass overtone
        this.playTone(freq * 0.5, dur * 0.9, 'sine', 0.12);
        if (this.onNoteCallback) {
          this.onNoteCallback(verse, note);
        }
      }, delay);
      this.anthemTimeoutIds.push(id);
    });

    // Reset when finished
    const endId = window.setTimeout(() => {
      this.isPlayingAnthem = false;
      if (this.onNoteCallback) {
        this.onNoteCallback(0, '');
      }
    }, 21200);
    this.anthemTimeoutIds.push(endId);
  }

  stopAnthem() {
    this.isPlayingAnthem = false;
    this.anthemTimeoutIds.forEach((id) => clearTimeout(id));
    this.anthemTimeoutIds = [];
    if (this.onNoteCallback) {
      this.onNoteCallback(0, '');
    }
  }

  isAnthemPlaying(): boolean {
    return this.isPlayingAnthem;
  }
}

export const senaAudio = new SenaAudioController();
