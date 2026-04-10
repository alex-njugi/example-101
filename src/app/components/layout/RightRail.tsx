import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unifiedSearch } from '../../services/search';
import { usePlayer } from '../../store/playerStore';
import { Search as SearchIcon, Play, X } from 'lucide-react';

type Artist = { name: string; image?: string };
type Podcast = { title: string; artwork?: string; artist?: string };

export default function RightRail() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [pods, setPods] = useState<Podcast[]>([]);
  const { queue, current, playAt, removeAt } = usePlayer();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  useEffect(() => {
    unifiedSearch('guitar', 20).then(list => {
      const m = new Map<string, Artist>();
      for (const t of list) if (t.artist && !m.has(t.artist)) m.set(t.artist, { name: t.artist, image: t.artwork });
      setArtists([...m.values()].slice(0, 8));
    });
    unifiedSearch('podcast', 8).then(list => {
      setPods(list.slice(0, 2).map(t => ({ title: t.title, artwork: t.artwork, artist: t.artist })));
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-8">
      <form onSubmit={onSubmit} className="relative">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search for something"
          className="w-full bg-white/10 rounded-xl pl-4 pr-10 py-2 outline-none focus:ring focus:ring-brand-500/40"
        />
        <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-white/70" />
      </form>

      <section>
        <h3 className="text-lg font-semibold mb-3">Popular Artists</h3>
        <div className="grid grid-cols-4 gap-3">
          {artists.map(a => (
            <div key={a.name} className="text-center">
              {a.image ? (
                <img src={a.image} className="w-16 h-16 rounded-xl object-cover mx-auto" />
              ) : <div className="w-16 h-16 rounded-xl bg-white/10 mx-auto" />}
              <div className="text-xs mt-1 truncate">{a.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Top Podcasts</h3>
        <div className="space-y-3">
          {pods.map(p => (
            <div key={p.title} className="flex items-center gap-3">
              {p.artwork ? <img src={p.artwork} className="w-28 h-16 rounded-lg object-cover" /> : <div className="w-28 h-16 rounded-lg bg-white/10" />}
              <div className="min-w-0">
                <div className="truncate">{p.title}</div>
                <div className="text-xs text-white/60 truncate">{p.artist || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Next in Queue</h3>
        <div className="space-y-2">
          {queue.map((t, i) => (
            <div key={`${t.source}-${t.id}`} className={`p-2 rounded-lg flex items-center gap-3 ${i===current?'bg-white/10':'hover:bg-white/5'}`}>
              {t.artwork ? <img src={t.artwork} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-white/10" />}
              <div className="flex-1 min-w-0">
                <div className="truncate">{t.title}</div>
                <div className="text-[11px] text-white/50 truncate">{t.artist} • {t.source}</div>
              </div>
              <button
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                onClick={()=>playAt(i)}
                aria-label="Play"
                title="Play"
              >
                <Play size={16} />
              </button>
              <button
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                onClick={()=>removeAt(i)}
                aria-label="Remove from queue"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {queue.length === 0 && <div className="text-sm text-white/50">Nothing queued.</div>}
        </div>
      </section>
    </div>
  );
}
