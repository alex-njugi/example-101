import { useEffect, useRef } from 'react';
import { usePlayer } from '../store/playerStore';
import { updateMediaSession } from '../services/mediaSession';
import { getOfflineURL } from '../services/offline';

export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { queue, current, playing, volume, next, prev, setPlaying } = usePlayer();

  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current;
    a.preload = 'metadata';
    a.crossOrigin = 'anonymous';
    a.volume = volume;

    const onEnded = () => next();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('ended', onEnded);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.pause();
    };
  }, []);

  // Load current track (prefer offline blob)
  useEffect(() => {
    const a = audioRef.current!;
    const track = queue[current];
    if (!track) return;

    (async () => {
      const offline = await getOfflineURL(track.id);
      a.src = offline || track.audioUrl;
      a.currentTime = 0;
      if (playing) a.play().catch(() => {});
      updateMediaSession(track, {
        onPlay: () => a.play(),
        onPause: () => a.pause(),
        onNext: next,
        onPrev: prev,
      });
    })();
  }, [queue, current]);

  useEffect(() => {
    const a = audioRef.current!;
    if (!a) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return { audio: audioRef };
}
