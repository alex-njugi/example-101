import type { Track } from '../types';
import { searchJamendoTracks } from './jamendo';

export async function unifiedSearch(query: string, limitPerSource = 20): Promise<Track[]> {
  // Jamendo only
  return await searchJamendoTracks(query, limitPerSource);
}
