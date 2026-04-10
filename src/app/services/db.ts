import Dexie, { Table } from 'dexie';
import type { Playlist, Track } from '../types';

export class LibraryDB extends Dexie {
  tracks!: Table<Track, string>;
  liked!: Table<{ id: string }, string>;
  playlists!: Table<Playlist, string>;
  downloads!: Table<{ id: string; blob: Blob; mime?: string; cachedAt: number }, string>; // ⬅️ blob

  constructor() {
    super('circle-library');
    this.version(3).stores({
      tracks: 'id, source, title, artist',
      liked: 'id',
      playlists: 'id, name, createdAt',
      downloads: 'id, cachedAt' // Dexie stores blob automatically
    });
  }
}
export const db = new LibraryDB();
