// src/app/services/audius.ts
import type { Track } from '../types';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'CirclePlayer';

let cachedHost: string | null = null;

async function fetchJSON(url: string, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

async function chooseHost(): Promise<string> {
  if (cachedHost) return cachedHost;

  // 1) get discovery list
  const disc = await fetchJSON('https://api.audius.co');
  const hosts: string[] = disc?.data || [];
  if (!hosts.length) throw new Error('No Audius hosts found');

  // 2) probe for the first that answers a tiny trending request
  for (const h of hosts) {
    try {
      const test = await fetch(`${h}/v1/tracks/trending?limit=1&app_name=${APP_NAME}`, { method: 'GET' });
      if (test.ok) {
        cachedHost = h;
        break;
      }
    } catch { /* try next host */ }
  }
  if (!cachedHost) cachedHost = hosts[0];
  return cachedHost!;
}

/** Map raw Audius track -> our Track */
function mapAudius(t: any, host: string): Track {
  return {
    id: t.id,
    source: 'audius',
    title: t.title,
    artist: t.user?.name || 'Unknown',
    album: t.album || undefined,
    durationSec: Number(t.duration || 0),
    artwork: t.artwork?.['480x480'] || t.artwork?.['150x150'] || undefined,
    audioUrl: `${host}/v1/tracks/${t.id}/stream?app_name=${APP_NAME}`,
    downloadable: Boolean(t.downloadable || t.is_downloadable),
    tags: t.genre ? [t.genre] : [],
  };
}

/** Trending tracks (optionally by genre and time window) */
export async function getTrending(opts: { limit?: number; genre?: string; time?: 'week'|'month'|'year'|'allTime' } = {}): Promise<Track[]> {
  const { limit = 20, genre, time } = opts;
  const host = await chooseHost();
  const params = new URLSearchParams({ limit: String(limit), app_name: APP_NAME });
  if (genre) params.set('genre', genre);
  if (time) params.set('time', time); // SDK docs: week|month|allTime
  const url = `${host}/v1/tracks/trending?${params.toString()}`;
  const json = await fetchJSON(url);
  const items: any[] = json?.data || [];
  return items.map((t) => mapAudius(t, host));
}

/** Text search */
export async function searchAudiusTracks(query: string, limit = 20): Promise<Track[]> {
  const host = await chooseHost();
  const url = `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}&app_name=${APP_NAME}`;
  const json = await fetchJSON(url);
  const items: any[] = json?.data || [];
  return items.map((t) => mapAudius(t, host));
}
