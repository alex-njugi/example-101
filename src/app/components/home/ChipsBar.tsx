import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const chips = ['Music', 'Indie', 'Jazz', 'Electronic', 'Rock Classic', 'Hip Hop'];

export default function ChipsBar() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const activeKey = useMemo(() => (sp.get('q') || '').toLowerCase(), [sp]);
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll the active chip into view when route changes
  useEffect(() => {
    if (!listRef.current || !activeKey) return;
    const el = listRef.current.querySelector<HTMLButtonElement>(
      `button[data-chip="${CSS.escape(activeKey)}"]`
    );
    if (!el) return;
    const parent = listRef.current;
    const r = el.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    if (r.left < pr.left) parent.scrollBy({ left: r.left - pr.left - 12, behavior: 'smooth' });
    if (r.right > pr.right) parent.scrollBy({ left: r.right - pr.right + 12, behavior: 'smooth' });
  }, [activeKey]);

  function goTo(label: string) {
    nav(`/search?q=${encodeURIComponent(label)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx =
      chips.findIndex((c) => c.toLowerCase() === activeKey) >= 0
        ? chips.findIndex((c) => c.toLowerCase() === activeKey)
        : 0;
    const nextIdx =
      e.key === 'ArrowRight' ? (idx + 1) % chips.length : (idx - 1 + chips.length) % chips.length;
    goTo(chips[nextIdx]);
  }

  return (
    <div className="relative">
      <div
        ref={listRef}
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Quick filters"
        onKeyDown={onKeyDown}
      >
        {chips.map((c) => {
          const key = c.toLowerCase();
          const active = key === activeKey;
          return (
            <button
              key={c}
              data-chip={key}
              role="tab"
              aria-selected={active}
              onClick={() => goTo(c)}
              className={`chip ${active ? 'bg-white/20 text-white shadow-card' : ''}`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
