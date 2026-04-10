import { create } from 'zustand';
import type { Playlist, Track } from '../types';
import { db } from '../services/db';


export type LibraryState = {
liked: Set<string>;
playlists: Playlist[];
load: () => Promise<void>;
toggleLike: (trackId: string) => Promise<void>;
createPlaylist: (name: string) => Promise<Playlist>;
renamePlaylist: (id: string, name: string) => Promise<void>;
deletePlaylist: (id: string) => Promise<void>;
addToPlaylist: (id: string, track: Track) => Promise<void>;
removeFromPlaylist: (id: string, trackId: string) => Promise<void>;
};


export const useLibrary = create<LibraryState>((set, get) => ({
liked: new Set<string>(),
playlists: [],


async load() {
const rows = await db.liked.toArray();
const playlists = await db.playlists.toArray();
set({ liked: new Set(rows.map((r) => r.id)), playlists });
},


async toggleLike(trackId) {
const liked = new Set(get().liked);
if (liked.has(trackId)) {
await db.liked.delete(trackId);
liked.delete(trackId);
} else {
await db.liked.put({ id: trackId });
liked.add(trackId);
}
set({ liked });
},


async createPlaylist(name) {
const p: Playlist = { id: crypto.randomUUID(), name, trackIds: [], createdAt: Date.now() };
await db.playlists.put(p);
set({ playlists: [...get().playlists, p] });
return p;
},


async renamePlaylist(id, name) {
await db.playlists.update(id, { name });
set({ playlists: (await db.playlists.toArray()) });
},


async deletePlaylist(id) {
await db.playlists.delete(id);
set({ playlists: (await db.playlists.toArray()) });
},


async addToPlaylist(id, track) {
// Persist track metadata for later
await db.tracks.put(track);
const p = await db.playlists.get(id);
if (!p) return;
if (!p.trackIds.includes(track.id)) p.trackIds.push(track.id);
await db.playlists.put(p);
set({ playlists: (await db.playlists.toArray()) });
},


async removeFromPlaylist(id, trackId) {
const p = await db.playlists.get(id);
if (!p) return;
p.trackIds = p.trackIds.filter((t) => t !== trackId);
await db.playlists.put(p);
set({ playlists: (await db.playlists.toArray()) });
},
}));