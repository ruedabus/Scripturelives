/**
 * Bible Bowl — in-browser audio engine using Web Audio API.
 * No files to host, no copyright issues. Generates all music and SFX
 * from oscillators.
 *
 * Usage (host page only):
 *   const audio = getGameAudio();
 *   audio.toggle();              // enable/disable
 *   audio.setScene("lobby");     // background music scene
 *   audio.buzzIn();              // one-shot SFX
 *   audio.correct();             // one-shot SFX
 *   audio.wrong();               // one-shot SFX
 *   audio.setVolume(0.6);        // 0–1
 */

export type AudioScene = "lobby" | "question" | "off";

// ── Frequency constants (equal temperament) ────────────────────────────────
const NOTE = {
  C3:  130.81, D3:  146.83, E3:  164.81, F3:  174.61, G3:  196.00, A3:  220.00, B3:  246.94,
  C4:  261.63, D4:  293.66, E4:  329.63, F4:  349.23, G4:  392.00, A4:  440.00, B4:  493.88,
  C5:  523.25, D5:  587.33, E5:  659.25, F5:  698.46, G5:  783.99, A5:  880.00, B5:  987.77,
  C6: 1046.50,
  Eb4: 311.13, Bb3: 233.08, Bb4: 466.16,
};

// I - V - vi - IV in C major (worship staple)
const LOBBY_CHORDS: number[][] = [
  [NOTE.C3, NOTE.C4, NOTE.E4, NOTE.G4],   // C major
  [NOTE.G3, NOTE.B3, NOTE.D4, NOTE.G4],   // G major
  [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.A4],   // A minor
  [NOTE.F3, NOTE.C4, NOTE.F4, NOTE.A4],   // F major
];

class GameAudioEngine {
  private ctx:         AudioContext | null = null;
  private masterGain:  GainNode     | null = null;
  private loopTimer:   ReturnType<typeof setTimeout> | null = null;
  private _scene:      AudioScene   = "off";
  private _enabled:    boolean      = false;
  private _volume:     number       = 0.45;
  private chordIdx:    number       = 0;
  private tickCount:   number       = 0;

  // ── Context init (must happen after a user gesture) ──────────────────────

  private ctx_(): AudioContext {
    if (!this.ctx) {
      this.ctx       = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  // ── Low-level oscillator helper ──────────────────────────────────────────

  private osc(
    freq:      number,
    dur:       number,
    type:      OscillatorType = "sine",
    peak:      number         = 0.2,
    delay:     number         = 0,
    attack:    number         = 0.04,
    release:   number         = 0.1,
  ) {
    const ctx   = this.ctx_();
    const o     = ctx.createOscillator();
    const g     = ctx.createGain();
    o.connect(g);
    g.connect(this.masterGain!);
    o.type            = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setValueAtTime(peak, t + Math.max(attack, dur - release));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private chord(
    freqs: number[],
    dur:   number,
    type:  OscillatorType = "sine",
    peak:  number         = 0.12,
    delay: number         = 0,
  ) {
    freqs.forEach(f => this.osc(f, dur, type, peak, delay, 0.08, 0.25));
  }

  // ── One-shot SFX ─────────────────────────────────────────────────────────

  /** ⚡ Buzz-in — fast ascending arpeggio */
  buzzIn() {
    if (!this._enabled) return;
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) =>
      this.osc(f, 0.14, "square", 0.28, i * 0.07, 0.01, 0.05)
    );
  }

  /** ✅ Correct answer — uplifting jingle */
  correct() {
    if (!this._enabled) return;
    this.chord([NOTE.C5, NOTE.E5, NOTE.G5], 0.28, "triangle", 0.22, 0);
    this.osc(NOTE.C6, 0.45, "triangle", 0.28, 0.26, 0.02, 0.18);
  }

  /** ❌ Wrong / no answer — descending trombone */
  wrong() {
    if (!this._enabled) return;
    this.osc(NOTE.Eb4, 0.22, "sawtooth", 0.22, 0.00, 0.01, 0.08);
    this.osc(NOTE.D4,  0.22, "sawtooth", 0.18, 0.20, 0.01, 0.08);
    this.osc(NOTE.Bb3, 0.35, "sawtooth", 0.14, 0.38, 0.01, 0.12);
  }

  /** 🏆 Round advance — triumphant rising phrase */
  advance() {
    if (!this._enabled) return;
    const melody = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5];
    melody.forEach((f, i) => this.osc(f, 0.22, "triangle", 0.22, i * 0.11, 0.02, 0.08));
  }

  /** 🎉 Tournament complete — full fanfare */
  fanfare() {
    if (!this._enabled) return;
    const seq: [number, number][] = [
      [NOTE.C4, 0.12], [NOTE.C4, 0.12], [NOTE.C4, 0.12],
      [NOTE.E4, 0.35], [NOTE.D4, 0.12], [NOTE.E4, 0.12],
      [NOTE.G4, 0.55], [NOTE.G4, 0.12], [NOTE.A4, 0.12],
      [NOTE.G4, 0.12], [NOTE.F4, 0.12], [NOTE.E4, 0.12],
      [NOTE.C5, 0.70],
    ];
    let t = 0;
    seq.forEach(([f, d]) => {
      this.osc(f, d, "triangle", 0.3, t, 0.02, 0.05);
      this.osc(f / 2, d, "sine", 0.12, t, 0.02, 0.05);
      t += d + 0.03;
    });
  }

  // ── Background music scenes ───────────────────────────────────────────────

  private stopLoop() {
    if (this.loopTimer) { clearTimeout(this.loopTimer); this.loopTimer = null; }
  }

  setScene(scene: AudioScene) {
    this.stopLoop();
    this._scene = scene;
    if (!this._enabled || scene === "off") return;
    if (scene === "lobby")    { this.chordIdx = 0; this.runLobby(); }
    if (scene === "question") { this.tickCount = 0; this.runQuestion(); }
  }

  /** Gentle worship pad — I-V-vi-IV cycling with bass note */
  private runLobby() {
    if (this._scene !== "lobby" || !this._enabled) return;
    const freqs = LOBBY_CHORDS[this.chordIdx % LOBBY_CHORDS.length];
    this.chord(freqs, 2.6, "sine", 0.08);                // upper chord
    this.osc(freqs[0] * 0.5, 2.6, "sine", 0.10);         // bass octave below
    this.chordIdx++;
    this.loopTimer = setTimeout(() => this.runLobby(), 2900);
  }

  /** Tense countdown pulse — speeds up slightly each tick */
  private runQuestion() {
    if (this._scene !== "question" || !this._enabled) return;
    const beat = this.tickCount;
    // Hi-hat style tick every beat
    const pingFreq  = beat % 2 === 0 ? NOTE.A5 : NOTE.E5;
    const pingGain  = beat % 4 === 0 ? 0.14 : 0.08;
    this.osc(pingFreq, 0.06, "square", pingGain, 0, 0.005, 0.03);
    // Bass pulse every 4 beats
    if (beat % 4 === 0) this.osc(NOTE.C3, 0.35, "sine", 0.10);
    // Subtle tension chord every 8 beats
    if (beat % 8 === 0) this.chord([NOTE.G3, NOTE.D4, NOTE.Bb4], 1.2, "sine", 0.06);
    this.tickCount++;
    const interval = Math.max(300, 560 - beat * 4); // 560ms → ~300ms over ~65 ticks
    this.loopTimer = setTimeout(() => this.runQuestion(), interval);
  }

  // ── Enable / disable / volume ─────────────────────────────────────────────

  get enabled()    { return this._enabled; }
  get volume()     { return this._volume;  }
  get scene()      { return this._scene;   }

  enable() {
    this._enabled = true;
    this.ctx_();  // init on user gesture
    if (this.masterGain) this.masterGain.gain.value = this._volume;
    // Re-start current scene if there is one
    if (this._scene !== "off") this.setScene(this._scene);
  }

  disable() {
    this._enabled = false;
    this.stopLoop();
  }

  toggle(scene?: AudioScene): boolean {
    if (this._enabled) { this.disable(); return false; }
    else { this.enable(); if (scene) this.setScene(scene); return true; }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) this.masterGain.gain.value = this._volume;
  }

  destroy() {
    this.stopLoop();
    this.ctx?.close();
    this.ctx = null;
  }
}

// ── Singleton (one engine per browser tab) ────────────────────────────────

let _instance: GameAudioEngine | null = null;

export function getGameAudio(): GameAudioEngine {
  if (typeof window === "undefined") return new GameAudioEngine(); // SSR no-op
  return (_instance ??= new GameAudioEngine());
}
