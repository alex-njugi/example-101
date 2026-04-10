// Jamendo-only service
import type { Track } from '../types';

const JAMENDO_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID as string;
const BASE = 'https://api.jamendo.com/v3.0';

function requireId() {
  if (!JAMENDO_ID) throw new Error('Missing VITE_JAMENDO_CLIENT_ID in .env');
}

function mapTrack(t: any): Track {
  return {
    id: String(t.id),
    source: 'jamendo',
    title: t.name,
    artist: t.artist_name,
    album: t.album_name || undefined,
    durationSec: Number(t.duration || 0),
    artwork: t.album_image || t.image || undefined,
    audioUrl: t.audio, // mp32 stream
    licenseUrl: t.license_ccurl,
    downloadable: !!t.audiodownload_allowed,
    lyrics: t.lyrics ? { raw: t.lyrics } : undefined,
    tags: t.musicinfo?.tags?.genres || [],
  };
}

async function getJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jamendo ${res.status}`);
  return res.json();
}

/** General search against Jamendo tracks */
export async function searchJamendoTracks(query: string, limit = 20): Promise<Track[]> {
  requireId();
  const params = new URLSearchParams({
    client_id: JAMENDO_ID,
    format: 'json',
    limit: String(limit),
    search: query,             // broad search: title/artist/album
    audioformat: 'mp32',
    include: 'lyrics+musicinfo+stats',
    imagesize: '300'
  });
  const json = await getJSON(`${BASE}/tracks/?${params.toString()}`);
  const items: any[] = json?.results || [];
  return items.map(mapTrack);
}

/** Popular overall on Jamendo */
export async function getJamendoPopular(limit = 12): Promise<Track[]> {
  requireId();
  const params = new URLSearchParams({
    client_id: JAMENDO_ID,
    format: 'json',
    limit: String(limit),
    order: 'popularity_total',
    audioformat: 'mp32',
    include: 'lyrics+musicinfo+stats',
    imagesize: '300'
  });
  const json = await getJSON(`${BASE}/tracks/?${params.toString()}`);
  const items: any[] = json?.results || [];
  return items.map(mapTrack);
}
