import { useEffect, useRef } from 'react';
import { usePlayer } from '../../store/playerStore';
import { Play, X } from 'lucide-react';

export default function QueueDrawer({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const { queue, current, playAt, removeAt } = usePlayer();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Queue">
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close queue overlay" />
      <div ref={panelRef} tabIndex={-1} className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-900 border-l border-white/10 p-4 overflow-y-auto focus:outline-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Next in Queue</h2>
          <button className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <ul className="space-y-2">
          {queue.map((t, i) => (
            <li key={`${t.source}-${t.id}`} className={`p-2 rounded-lg flex items-center gap-3 ${i===current? 'bg-white/10' : 'hover:bg-white/5'}`}>
              {t.artwork ? <img src={t.artwork} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-white/10" />}
              <div className="flex-1 min-w-0">
                <div className="truncate">{t.title}</div>
                <div className="text-[11px] text-white/50 truncate">{t.artist} • {t.source}</div>
              </div>
              <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded" onClick={()=>playAt(i)} aria-label="Play">
                <Play size={16} />
              </button>
              <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded" onClick={()=>removeAt(i)} aria-label="Remove from queue">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
