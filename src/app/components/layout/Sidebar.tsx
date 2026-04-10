import { NavLink } from 'react-router-dom';
import { Home, Search, Music4, Bell, Gem, ChevronDown, UserCircle2 } from 'lucide-react';

const Item = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-xl mx-3 my-1 ${
        isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/80'
      }`
    }
  >
    {icon}<span className="font-medium">{label}</span>
  </NavLink>
);

export function Sidebar() {
  return (
    <div className="h-full flex flex-col pt-6">
      {/* Logo row */}
      <div className="px-6 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center">C</div>
        <div className="text-2xl font-bold">Circle</div>
      </div>

      <nav>
        <Item to="/" label="Home" icon={<Home size={18} />} />
        <Item to="/search" label="Search" icon={<Search size={18} />} />
        <Item to="/library" label="Playlists" icon={<Music4 size={18} />} />
        {/* Notifications with blue dot */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl mx-3 my-1 hover:bg-white/5 text-white/80">
          <Bell size={18} /><span className="font-medium">Notifications</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-sky-400" />
        </div>
        <Item to="/library" label="Premium Content" icon={<Gem size={18} />} />
      </nav>

      <div className="mt-auto p-4 text-xs text-white/60 underline/30">
        Download Desktop App
      </div>

      {/* tiny profile tile */}
      <div className="m-3 p-2 rounded-xl bg-white/5 flex items-center gap-2">
        <UserCircle2 size={22} className="text-white/80" />
        <div className="text-sm">Jonathon Trott</div>
        <ChevronDown size={16} className="ml-auto text-white/60" />
      </div>
    </div>
  );
}
