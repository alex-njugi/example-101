import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useLibrary } from '../store/libraryStore';
import { usePlayer } from '../store/playerStore';
import { db } from '../services/db';
import TrackCard from '../components/media/TrackCard';
import type { Track } from '../types';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, renamePlaylist, deletePlaylist } = useLibrary();
  const { setQueue } = usePlayer();

  const pl = useMemo(() => playlists.find((p) => p.id === id), [playlists, id]);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    (async () => {
      if (!pl) return;
      const rows = await db.tracks.bulkGet(pl.trackIds);
      setTracks((rows.filter(Boolean) as Track[]) || []);
    })();
    // re-run when trackIds change length (simple local trigger)
  }, [pl?.id, pl?.trackIds.length]);

  if (!pl) return <div className="subtitle">Playlist not found.</div>;

  async function onRename() {
    const name = prompt('Rename playlist', pl.name);
    if (name && name.trim()) await renamePlaylist(pl.id, name.trim());
  }

  async function onDelete() {
    if (confirm('Delete this playlist?')) {
      await deletePlaylist(pl.id);
      navigate(-1);
    }
  }

  function onPlayAll(shuffle = false) {
    if (tracks.length === 0) return;
    const list = shuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks;
    setQueue(list, 0);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="title">{pl.name}</h1>
        <button className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20" onClick={onRename}>
          Rename
        </button>
        <button className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20" onClick={onDelete}>
          Delete
        </button>
        <button
          className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30"
          onClick={() => onPlayAll(false)}
        >
          Play all
        </button>
        <button
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
          onClick={() => onPlayAll(true)}
        >
          Shuffle
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="subtitle">No tracks in this playlist yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tracks.map((t) => (
            <TrackCard key={`${t.source}-${t.id}`} track={t} />
          ))}
        </div>
      )}
    </div>
  );
}
