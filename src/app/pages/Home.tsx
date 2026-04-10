import { useEffect, useState } from 'react';
import ChipsBar from '../components/home/ChipsBar';
import HeroPlaylistCard from '../components/home/HeroPlaylistCard';
import { unifiedSearch } from '../services/search';
import { getJamendoPopular } from '../services/jamendo';
import type { Track } from '../types';
import AlbumCard from '../components/media/AlbumCard';
import TrackCard from '../components/media/TrackCard';
import { useLibrary } from '../store/libraryStore';

type Album = { title: string; artist?: string; artwork?: string; count: number };

export default function Home() {
  const { load } = useLibrary();
  const [popularAlbums, setPopularAlbums] = useState<Album[]>([]);
  const [musicRow, setMusicRow] = useState<Track[]>([]);
  const [picked, setPicked] = useState<Track | null>(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    // Build "Popular Albums" + long "Music" row using Jamendo search only
    unifiedSearch('music', 30).then(list => {
      const map = new Map<string, Album>();
      for (const t of list) {
        if (!t.album) continue;
        const key = `${t.album}__${t.artist || ''}`;
        const prev = map.get(key) || { title: t.album, artist: t.artist, artwork: t.artwork, count: 0 };
        prev.count++;
        if (!prev.artwork && t.artwork) prev.artwork = t.artwork;
        map.set(key, prev);
      }
      setPopularAlbums([...map.values()].sort((a, b) => b.count - a.count).slice(0, 3));
      setMusicRow(list.slice(0, 12));
    });

    // “Picked for you” from Jamendo Popular
    getJamendoPopular(12).then((list) => setPicked(list[0] || null));
  }, []);

  return (
    <div className="space-y-8">
      <ChipsBar />

      {/* Popular Albums (3 cards like the reference) */}
      <section>
        <h2 className="title mb-3">Popular Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularAlbums.map(a => (
            <AlbumCard key={`${a.title}-${a.artist}`} title={a.title} artist={a.artist} artwork={a.artwork} />
          ))}
        </div>
      </section>

      {/* Picked for you large card */}
      <section>
        <h2 className="title mb-3">Picked for you</h2>
        <HeroPlaylistCard
          artwork={picked?.artwork}
          title="New Music Friday Pakistan"
          blurb="Listen to the fresh new music from Pakistan and around the world."
        />
      </section>

      {/* Music row */}
      <section>
        <h2 className="title mb-3">Music</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {musicRow.map((t) => (
            <TrackCard key={`${t.source}-${t.id}`} track={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
