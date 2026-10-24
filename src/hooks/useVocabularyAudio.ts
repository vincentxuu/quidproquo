import { useEffect, useRef, useState } from 'react';
import { parseVoice, speakingVoices, SPEAKING_VOICE_KEY, type SpeakingVoice } from '../lib/english-speaking';

const PLAYBACK_EVENT = 'qp:vocabulary-audio-start';

type Playback = { id: string; controller: AbortController; audio?: HTMLAudioElement; url?: string };

/** The same four Aura voices as /english; playback never uses browser speech synthesis. */
export function useVocabularyAudio(en: boolean) {
  const [voice, setVoiceState] = useState<SpeakingVoice>(speakingVoices[0].id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const playback = useRef<Playback | null>(null);
  const blobs = useRef(new Map<string, Blob>());

  function release(current: Playback | null) {
    if (!current) return;
    current.controller.abort();
    if (current.audio) {
      current.audio.onended = null; current.audio.onerror = null;
      current.audio.pause(); current.audio.removeAttribute('src'); current.audio.load();
    }
    if (current.url) URL.revokeObjectURL(current.url);
  }
  function stop() {
    release(playback.current); playback.current = null;
    setActiveId(null); setLoadingId(null);
  }
  useEffect(() => {
    try { setVoiceState(parseVoice(localStorage.getItem(SPEAKING_VOICE_KEY))); } catch { /* Default still works without preference storage. */ }
    const stopOtherPlayback = () => stop();
    window.addEventListener(PLAYBACK_EVENT, stopOtherPlayback);
    return () => { window.removeEventListener(PLAYBACK_EVENT, stopOtherPlayback); release(playback.current); playback.current = null; };
  }, []);

  function setVoice(next: SpeakingVoice) {
    stop(); setError(''); setVoiceState(next);
    try { localStorage.setItem(SPEAKING_VOICE_KEY, next); } catch { /* Keep the selection for this visit. */ }
  }
  async function speak(text: string, id: string) {
    if (playback.current?.id === id) { stop(); return; }
    window.dispatchEvent(new Event(PLAYBACK_EVENT));
    stop(); setError('');
    const current: Playback = { id, controller: new AbortController() };
    playback.current = current; setActiveId(id); setLoadingId(id);
    const key = `${voice}:${text}`;
    try {
      let blob = blobs.current.get(key);
      if (!blob) {
        const response = await fetch('/api/tts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }), signal: current.controller.signal,
        });
        if (!response.ok || !response.headers.get('Content-Type')?.startsWith('audio/')) throw new Error('Audio unavailable');
        blob = await response.blob();
        if (!blob.size) throw new Error('Audio is empty');
        if (blobs.current.size >= 32) blobs.current.delete(blobs.current.keys().next().value!);
        blobs.current.set(key, blob);
      }
      if (playback.current !== current || current.controller.signal.aborted) return;
      current.url = URL.createObjectURL(blob);
      const audio = new Audio(current.url); current.audio = audio;
      const finish = () => { if (playback.current === current) stop(); };
      audio.onended = finish;
      audio.onerror = () => { finish(); setError(en ? 'Audio could not play. Try again.' : '音訊無法播放，請再試一次。'); };
      setLoadingId(null);
      await audio.play();
    } catch {
      if (playback.current !== current || current.controller.signal.aborted) return;
      stop(); setError(en ? 'Pronunciation is unavailable. Try again.' : '目前無法播放發音，請稍後再試。');
    }
  }
  return { voice, setVoice, voices: speakingVoices, activeId, loadingId, error, speak, stop };
}
