import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { unifiedSearch } from '../services/search';
import type { Track } from '../types';
import TrackCard from '../components/media/TrackCard';
import AlbumCard from '../components/media/AlbumCard';
import ArtistCard from '../components/media/ArtistCard';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search() {
  const q = useQuery().get('q') || '';
  const [tab, setTab] = useState<'all'|'tracks'|'artists'|'albums'>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Track[]>([]);
  const [artists, setArtists] = useState<{ name: string; image?: string }[]>([]);
  const [albums, setAlbums] = useState<{ title: string; artist?: string; artwork?: string }[]>([]);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    unifiedSearch(q, 20).then((list) => {
      setResults(list);
      const artistMap = new Map<string, { name: string; image?: string }>();
      const albumMap = new Map<string, { title: string; artist?: string; artwork?: string }>();
      for (const t of list) {
        if (t.artist && !artistMap.has(t.artist)) artistMap.set(t.artist, { name: t.artist, image: t.artwork });
        if (t.album) {
          const key = `${t.album}__${t.artist||''}`;
          if (!albumMap.has(key)) albumMap.set(key, { title: t.album, artist: t.artist, artwork: t.artwork });
        }
      }
      setArtists([...artistMap.values()].slice(0, 12));
      setAlbums([...albumMap.values()].slice(0, 12));
    }).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="title">Search {q && (<span className="subtitle">for “{q}”</span>)}</h1>
        <div className="flex gap-2 text-sm">
          {(['all','tracks','artists','albums'] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full ${tab===t?'bg-white/20':'bg-white/10 hover:bg-white/20'}`}>{t}</button>
          ))}
        </div>
      </div>

      {loading && <div className="subtitle">Searching…</div>}

      {(tab==='all' || tab==='tracks') && (
        <>
          {tab==='all' && <h2 className="title text-base">Tracks</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((t) => <TrackCard key={`${t.source}-${t.id}`} track={t} />)}
          </div>
        </>
      )}

      {(tab==='all' || tab==='artists') && (
        <>
          {tab==='all' && <h2 className="title text-base mt-6">Artists</h2>}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {artists.map(a => <ArtistCard key={a.name} name={a.name} image={a.image} />)}
          </div>
        </>
      )}

      {(tab==='all' || tab==='albums') && (
        <>
          {tab==='all' && <h2 className="title text-base mt-6">Albums</h2>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {albums.map(a => <AlbumCard key={`${a.title}-${a.artist}`} title={a.title} artist={a.artist} artwork={a.artwork} />)}
          </div>
        </>
      )}
    </div>
  );
}
