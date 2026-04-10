import type { Track } from '../types';
import { db } from './db';

/**
 * Save an audio blob in IndexedDB so it can play offline later.
 * Returns true if saved.
 */
export async function cacheTrackForOffline(track: Track): Promise<boolean> {
  try {
    const res = await fetch(track.audioUrl, { mode: 'cors' });
    if (!res.ok) return false;
    const blob = await res.blob();
    // Keep metadata and the blob
    await db.tracks.put(track);
    await db.downloads.put({ id: track.id, blob, mime: blob.type, cachedAt: Date.now() });
    return true;
  } catch {
    return false;
  }
}

/** Get a blob URL for offline playback if present; otherwise null. */
export async function getOfflineURL(trackId: string): Promise<string | null> {
  const row = await db.downloads.get(trackId);
  if (!row) return null;
  return URL.createObjectURL(row.blob);
}

/** Remove a previously saved offline track. */
export async function removeOfflineTrack(trackId: string) {
  const row = await db.downloads.get(trackId);
  if (!row) return;
  // Revoke a temp object URL (safe even if not used)
  URL.revokeObjectURL(URL.createObjectURL(row.blob));
  await db.downloads.delete(trackId);
}
