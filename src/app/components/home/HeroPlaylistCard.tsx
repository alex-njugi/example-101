import { PlayIcon, HeartIcon } from '../ui/Icons';

export default function HeroPlaylistCard({
  artwork, title, blurb
}: { artwork?: string; title: string; blurb: string }) {
  return (
    <div className="card relative overflow-hidden p-4 md:p-6 flex items-center gap-4">
      {/* Left image */}
      {artwork ? (
        <img src={artwork} className="w-28 h-28 md:w-40 md:h-40 rounded-xl object-cover" />
      ) : <div className="w-28 h-28 md:w-40 md:h-40 rounded-xl bg-white/10" />}

      {/* Text block */}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-white/70">Playlist</div>
        <div className="text-xl md:text-2xl font-semibold truncate">{title}</div>
        <div className="text-sm text-white/70 line-clamp-2">{blurb}</div>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="badge">Podcasts</span>
          <span className="badge">Audio Books</span>
          <span className="badge">Classic Fusion</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-white/80">
          <button className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm">♡</button>
          <button className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm">↗</button>
        </div>
      </div>

      {/* Play circle (right) */}
      <div className="ml-auto">
        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
          <PlayIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
