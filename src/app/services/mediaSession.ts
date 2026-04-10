import type { Track } from '../types';


export function updateMediaSession(track: Track | null, handlers: {
onPlay: () => void;
onPause: () => void;
onNext: () => void;
onPrev: () => void;
}) {
if (!('mediaSession' in navigator)) return;
(navigator as any).mediaSession.metadata = track ? new window.MediaMetadata({
title: track.title,
artist: track.artist,
album: track.album,
artwork: track.artwork ? [
{ src: track.artwork, sizes: '300x300', type: 'image/png' }
] : []
}) : null;


const ms: any = (navigator as any).mediaSession;
ms.setActionHandler('play', handlers.onPlay);
ms.setActionHandler('pause', handlers.onPause);
ms.setActionHandler('nexttrack', handlers.onNext);
ms.setActionHandler('previoustrack', handlers.onPrev);
}