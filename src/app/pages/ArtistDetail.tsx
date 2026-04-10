import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unifiedSearch } from '../services/search';
import type { Track } from '../types';
import TrackCard from '../components/media/TrackCard';
import AlbumCard from '../components/media/AlbumCard';
import { usePlayer } from '../store/playerStore';

export default function ArtistDetail() {
  const { id } = useParams();
  const artistName = useMemo(() => decodeURIComponent(id || '').trim(), [id]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<{ title: string; artist?: string; artwork?: string }[]>([]);
  const { setQueue } = usePlayer();

  useEffect(() => {
    if (!artistName) return;
    setLoading(true);
    // Pull from both sources, then filter for exact artist match (case-insensitive)
    unifiedSearch(artistName, 30)
      .then((list) => {
        const exact = list.filter(
          (t) => t.artist && t.artist.toLowerCase() === artistName.toLowerCase()
        );
        setTracks(exact);

        // Build album list from these tracks
        const map = new Map<string, { title: string; artist?: string; artwork?: string; count: number }>();
        for (const t of exact) {
          if (!t.album) continue;
          const key = `${t.album}__${t.artist ?? ''}`;
          const prev = map.get(key);
          if (prev) {
            prev.count++;
            if (!prev.artwork && t.artwork) prev.artwork = t.artwork;
          } else {
            map.set(key, { title: t.album, artist: t.artist, artwork: t.artwork, count: 1 });
          }
        }
        const topAlbums = [...map.values()].sort((a, b) => b.count - a.count).slice(0, 12);
        setAlbums(topAlbums);
      })
      .finally(() => setLoading(false));
  }, [artistName]);

  const heroImage = tracks.find((t) => !!t.artwork)?.artwork;

  function playTop() {
    if (tracks.length) setQueue(tracks.slice(0, 30), 0);
  }
  function shufflePlay() {
    if (!tracks.length) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled.slice(0, 30), 0);
  }

  if (!artistName) return <div className="subtitle">No artist specified.</div>;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex items-center gap-4 md:gap-6">
        {heroImage ? (
          <img src={heroImage} alt="" className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-white/10" />
        )}
        <div>
          <div className="subtitle">Artist</div>
          <h1 className="title text-3xl md:text-4xl">{artistName}</h1>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30" onClick={playTop}>
              Play Top
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20" onClick={shufflePlay}>
              Shuffle
            </button>
          </div>
        </div>
      </section>

      {/* Top tracks */}
      <section>
        <h2 className="title mb-3">Top Tracks</h2>
        {loading ? (
          <div className="subtitle">Loading…</div>
        ) : tracks.length === 0 ? (
          <div className="subtitle">No tracks found for this artist.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tracks.map((t) => (
              <TrackCard key={`${t.source}-${t.id}`} track={t} />
            ))}
          </div>
        )}
      </section>

      {/* Albums */}
      {!!albums.length && (
        <section>
          <h2 className="title mb-3">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {albums.map((a) => (
              <AlbumCard key={`${a.title}-${a.artist}`} title={a.title} artist={a.artist} artwork={a.artwork} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
