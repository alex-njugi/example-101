import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../../store/playerStore';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { useAccentFromArtwork } from '../../hooks/useAccentFromArtwork';
import Volume from './Volume';
import QueueDrawer from './QueueDrawer';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function NowPlayingBar() {
  const { queue, current, playing, setPlaying, next, prev } = usePlayer();
  const { audio } = useAudioEngine();
  const t = queue[current];

  // Accent: softly tint bg/controls from artwork
  useAccentFromArtwork(t?.artwork);

  const [progress, setProgress] = useState(0); // 0..1
  const [buffered, setBuffered] = useState(0); // 0..1
  const [open, setOpen] = useState(false);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);

  const barRef = useRef<HTMLDivElement | null>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [seeking, setSeeking] = useState(false);

  // Wire to <audio> element for precise updates
  useEffect(() => {
    const a = audio.current;
    if (!a) return;

    const onTime = () => {
      setCur(a.currentTime || 0);
      const d = a.duration || 0;
      setDur(d);
      setProgress(d ? a.currentTime / d : 0);
      // buffered (last range end)
      if (a.buffered?.length) {
        const end = a.buffered.end(a.buffered.length - 1);
        setBuffered(d ? Math.min(end / d, 1) : 0);
      } else {
        setBuffered(0);
      }
    };
    const onDuration = () => setDur(a.duration || 0);

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('progress', onTime);
    a.addEventListener('durationchange', onDuration);

    // kick once
    onTime();

    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('progress', onTime);
      a.removeEventListener('durationchange', onDuration);
    };
  }, [audio]);

  // Scrub helpers
  const percentToTime = (pct: number) => (audio.current?.duration || 0) * pct;

  const updateFromClientX = (clientX: number) => {
    const el = barRef.current;
    const a = audio.current;
    if (!el || !a || !isFinite(a.duration) || a.duration <= 0) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    a.currentTime = percentToTime(pct);
    setCur(a.currentTime);
    setProgress(pct);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!audio.current) return;
    setSeeking(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!seeking) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setSeeking(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setHoverPct(pct);
  };
  const onMouseLeave = () => setHoverPct(null);

  // Keyboard support on the slider
  const step = 5; // seconds per arrow
  const onKeyDown = (e: React.KeyboardEvent) => {
    const a = audio.current;
    if (!a || !isFinite(a.duration)) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? step : -step;
      a.currentTime = Math.min(Math.max((a.currentTime || 0) + delta, 0), a.duration);
      setCur(a.currentTime);
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    }
  };

  const canControl = !!t;
  const hoverTime = useMemo(() => (hoverPct != null ? percentToTime(hoverPct) : null), [hoverPct]);

  return (
    <div className="border-t border-white/10 bg-black/70 backdrop-blur p-3 md:p-4 flex items-center gap-4">
      {/* Artwork + meta (opens queue) */}
      <button
        className="flex items-center gap-3 w-[320px] max-w-[40vw] text-left"
        onClick={() => setOpen(true)}
        aria-label="Open queue"
        title="Open queue"
      >
        {t?.artwork ? (
          <img src={t.artwork} alt="" className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-white/10" />
        )}
        <div className="truncate" aria-live="polite">
          <div className="font-medium truncate">{t?.title || 'Nothing playing'}</div>
          <div className="text-xs text-white/60 truncate">{t?.artist || '—'}</div>
        </div>
      </button>

      {/* Transport */}
      <div className="flex items-center gap-2 mx-auto">
        <button
          className="p-2 hover:bg-white/10 rounded-full disabled:opacity-40"
          onClick={prev}
          aria-label="Previous"
          disabled={!canControl}
          title="Previous"
        >
          <SkipBack size={18} />
        </button>

        <button
          className="p-2.5 rounded-full text-black shadow
                     disabled:opacity-40"
          style={{
            background: 'var(--accent-35, rgba(255,255,255,.85))'
          }}
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
          disabled={!canControl}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          className="p-2 hover:bg-white/10 rounded-full disabled:opacity-40"
          onClick={next}
          aria-label="Next"
          disabled={!canControl}
          title="Next"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Time + progress + volume */}
      <div className="flex items-center gap-3 w-[420px] max-w-[50vw]">
        {/* elapsed */}
        <div className="text-xs tabular-nums text-white/70 w-12 text-right">{fmt(cur)}</div>

        {/* progress rail (scrubbable) */}
        <div
          ref={barRef}
          className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={dur || 0}
          aria-valuenow={cur || 0}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          title="Seek"
        >
          {/* buffered */}
          <div
            className="absolute inset-y-0 left-0 bg-white/15"
            style={{ width: `${buffered * 100}%` }}
            aria-hidden
          />
          {/* played (accent) */}
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${progress * 100}%`,
              background:
                'linear-gradient(90deg, var(--accent, #8ab4ff), rgba(255,255,255,.85))'
            }}
          />
          {/* hover thumb */}
          {hoverPct != null && (
            <div
              className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow"
              style={{
                left: `${hoverPct * 100}%`,
                background: 'var(--accent, #8ab4ff)'
              }}
              aria-hidden
            />
          )}
          {/* hover time tooltip */}
          {hoverPct != null && (
            <div
              className="absolute -translate-x-1/2 -top-7 px-2 py-0.5 rounded bg-black/70 text-[11px]"
              style={{ left: `${hoverPct * 100}%` }}
            >
              {fmt(hoverTime || 0)}
            </div>
          )}
        </div>

        {/* duration */}
        <div className="text-xs tabular-nums text-white/70 w-12">{fmt(dur)}</div>

        <Volume />
      </div>

      <QueueDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
