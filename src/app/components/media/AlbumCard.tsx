import { Link } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';

export default function AlbumCard({ title, artwork, artist }: { title: string; artwork?: string; artist?: string }) {
  const href = `/album/${encodeURIComponent(title)}?artist=${encodeURIComponent(artist||'')}`;
  return (
    <Link to={href} className="card block p-2">
      <div className="relative">
        {artwork ? (
          <img src={artwork} className="w-full aspect-square object-cover rounded-xl" />
        ) : (
          <div className="w-full aspect-square rounded-xl bg-white/10" />
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Like">
            <Heart size={16} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center" aria-label="Play">
            <Play size={16} />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="font-medium leading-tight truncate">{title}</div>
        {artist && <div className="text-sm text-white/60 truncate">{artist}</div>}
        <div className="mt-2 text-xs text-white/60 flex items-center gap-2">
          <span>12 Tracks</span><span>•</span><span>31K Likes</span>
        </div>
      </div>
    </Link>
  );
}
