import { Sidebar } from './app/components/layout/Sidebar';
import NowPlayingBar from './app/components/player/NowPlayingBar';
import { AppRoutes } from './app/routes';
import RightRail from './app/components/layout/RightRail';

export default function App() {
  return (
    <div className="app-bg relative min-h-screen grid grid-rows-[1fr_auto] md:grid-cols-[280px_1fr_360px]">
      {/* Left rail */}
      <aside className="hidden md:block sidebar-bg border-r border-white/10" aria-label="Primary">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="p-4 md:p-6 space-y-8">
        <AppRoutes />
      </main>

      {/* Right rail */}
      <aside className="hidden md:block rail-bg border-l border-white/10" aria-label="Secondary">
        <RightRail />
      </aside>

      {/* Now Playing (sticky across viewport) */}
      <footer className="md:col-span-3 sticky bottom-0 z-40">
        <NowPlayingBar />
      </footer>
    </div>
  );
}
