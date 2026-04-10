import { useEffect, useState } from 'react';
import { useLibrary } from '../store/libraryStore';
import { db } from '../services/db';
import TrackCard from '../components/media/TrackCard';
import type { Track } from '../types';


export default function Library() {
const { liked, load } = useLibrary();
const [tracks, setTracks] = useState<Track[]>([]);


useEffect(() => { load(); }, []);
useEffect(() => {
(async () => {
const likedTracks = await db.tracks.bulkGet(Array.from(liked));
setTracks(likedTracks.filter(Boolean) as Track[]);
})();
}, [liked]);


return (
<div className="space-y-4">
<h1 className="title">Liked Songs</h1>
{tracks.length === 0 ? (
<div className="subtitle">No liked songs yet.</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
{tracks.map((t) => <TrackCard key={`${t.source}-${t.id}`} track={t} />)}
</div>
)}
</div>
);
}