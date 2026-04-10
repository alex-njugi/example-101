import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { unifiedSearch } from '../services/search';
import type { Track } from '../types';
import TrackCard from '../components/media/TrackCard';
import { usePlayer } from '../store/playerStore';

export default function AlbumDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const albumTitle = useMemo(() => decodeURIComponent(id || '').trim(), [id]);
  const artistHint = sp.get('artist')?.trim() || '';
  const [loading, setLoading] = useState<boolean>(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const { setQueue } = usePlayer();

  useEffect(() => {
    if (!albumTitle) return;
    setLoading(true);

    const q = artistHint ? `${artistHint} ${albumTitle}` : albumTitle;
    unifiedSearch(q, 40)
      .then((list) => {
        const filtered = list.filter((t) => {
          const matchAlbum = (t.album || '').toLowerCase() === albumTitle.toLowerCase();
          const matchArtist = artistHint ? (t.artist || '').toLowerCase() === artistHint.toLowerCase() : true;
          return matchAlbum && matchArtist;
        });
        setTracks(filtered);
      })
      .finally(() => setLoading(false));
  }, [albumTitle, artistHint]);

  const cover = tracks.find((t) => !!t.artwork)?.artwork;
  const artistName = tracks[0]?.artist || artistHint || '';

  function playAll() {
    if (tracks.length) setQueue(tracks, 0);
  }
  function shufflePlay() {
    if (!tracks.length) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled, 0);
  }

  if (!albumTitle) return <div className="subtitle">No album specified.</div>;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex items-center gap-4 md:gap-6">
        {cover ? (
          <img src={cover} alt="" className="w-24 h-24 md:w-36 md:h-36 rounded-xl object-cover" />
        ) : (
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-xl bg-white/10" />
        )}
        <div>
          <div className="subtitle">Album</div>
          <h1 className="title text-3xl md:text-4xl">{albumTitle}{artistName ? ` — ${artistName}` : ''}</h1>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30" onClick={playAll}>
              Play
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20" onClick={shufflePlay}>
              Shuffle
            </button>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section>
        <h2 className="title mb-3">Tracks</h2>
        {loading ? (
          <div className="subtitle">Loading…</div>
        ) : tracks.length === 0 ? (
          <div className="subtitle">No tracks found for this album.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tracks.map((t) => (
              <TrackCard key={`${t.source}-${t.id}`} track={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
