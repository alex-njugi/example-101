import { MouseEvent, useState } from 'react';
import { Play, Heart, Download, ExternalLink } from 'lucide-react';
import { usePlayer } from '../../store/playerStore';
import type { Track } from '../../types';
import SourceBadge from './SourceBadge';

export default function TrackCard({ track }: { track: Track }) {
  const { setQueue } = usePlayer();
  const [liked, setLiked] = useState(false);

  const play = (e?: MouseEvent) => {
    e?.preventDefault();
    setQueue([track], 0);
  };

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition
      "
    >
      {/* Artwork (no layout shift: fixed 1:1) */}
      <div className="relative aspect-square">
        {track.artwork ? (
          <img
            src={track.artwork}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        {/* Readability & polish */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Source */}
        <div className="absolute left-3 top-3">
          <SourceBadge source={track.source} />
        </div>

        {/* Hover actions (clean, icon-only) */}
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="size-9 rounded-full bg-black/35 backdrop-blur text-white hover:bg-black/55 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
            aria-label={liked ? 'Unlike' : 'Like'}
            title={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={16} className={liked ? 'fill-current' : ''} />
          </button>
          {track.licenseUrl && (
            <a
              href={track.licenseUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="size-9 rounded-full bg-black/35 backdrop-blur text-white hover:bg-black/55 flex items-center justify-center"
              aria-label="CC License"
              title="CC License"
            >
              <ExternalLink size={16} />
            </a>
          )}
          {track.source === 'jamendo' && track.downloadable && (
            <a
              href={track.audioUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="size-9 rounded-full bg-black/35 backdrop-blur text-white hover:bg-black/55 flex items-center justify-center"
              aria-label="Download"
              title="Download"
            >
              <Download size={16} />
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="absolute left-3 right-16 bottom-3">
          <div className="truncate text-[15px] font-semibold leading-tight">
            {track.title}
          </div>
          <div className="truncate text-xs text-white/70">
            {track.artist || 'Unknown Artist'}
          </div>
        </div>

        {/* Primary action */}
        <button
          onClick={play}
          className="
            absolute right-3 bottom-3 size-11 rounded-full
            bg-white text-black shadow
            flex items-center justify-center
            transition-transform group-hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
          "
          aria-label={`Play ${track.title}`}
          title="Play"
        >
          <Play size={18} />
        </button>
      </div>
    </div>
  );
}
