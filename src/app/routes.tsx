import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import ArtistDetail from './pages/ArtistDetail';
import AlbumDetail from './pages/AlbumDetail';


export function AppRoutes() {
return (
<Routes>
<Route path="/" element={<Home />} />
<Route path="/search" element={<Search />} />
<Route path="/library" element={<Library />} />
<Route path="/playlist/:id" element={<PlaylistDetail />} />
<Route path="/artist/:id" element={<ArtistDetail />} />
<Route path="/album/:id" element={<AlbumDetail />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
);
}