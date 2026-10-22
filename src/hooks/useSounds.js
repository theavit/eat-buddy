import { useCallback, useRef } from "react";

export function useSounds(soundOn) {
  const contextRef = useRef(null);
  const getContext = useCallback(() => {
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      contextRef.current = AudioContextClass ? new AudioContextClass() : null;
    }
    if (contextRef.current && contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }
    return contextRef.current;
  }, []);
  const tone = useCallback(
    (frequency, delay, duration, type, volume) => {
      if (!soundOn) {
        return;
      }
      const context = getContext();
      if (!context) {
        return;
      }
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume || 0.15, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    },
    [soundOn, getContext],
  );
  const click = useCallback(() => tone(720, 0, 0.06, "square", 0.08), [tone]);
  const whoosh = useCallback(() => {
    for (let step = 0; step < 6; step++) {
      tone(500 - step * 40, step * 0.05, 0.09, "triangle", 0.06);
    }
  }, [tone]);
  const win = useCallback(() => {
    [523, 659, 784].forEach((note, index) => tone(note, index * 0.12, 0.22, "sine", 0.12));
  }, [tone]);
  const coin = useCallback(() => {
    tone(880, 0, 0.08, "triangle", 0.1);
    tone(1108, 0.08, 0.12, "triangle", 0.1);
  }, [tone]);
  return {
    click,
    whoosh,
    win,
    coin,
  };
}
