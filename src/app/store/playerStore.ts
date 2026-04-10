import { create } from 'zustand';
import type { Track } from '../types';


export type PlayerState = {
queue: Track[];
current: number; // index in queue
playing: boolean;
volume: number; // 0..1
setQueue: (tracks: Track[], startIndex?: number) => void;
addNext: (track: Track) => void;
addToQueue: (track: Track) => void;
removeAt: (idx: number) => void;
playAt: (idx: number) => void;
setPlaying: (p: boolean) => void;
setVolume: (v: number) => void;
next: () => void;
prev: () => void;
};


export const usePlayer = create<PlayerState>((set, get) => ({
queue: [],
current: 0,
playing: false,
volume: 1,


setQueue: (tracks, startIndex = 0) => set({ queue: tracks, current: startIndex, playing: true }),
addNext: (track) => {
const { queue, current } = get();
const q = [...queue];
q.splice(current + 1, 0, track);
set({ queue: q });
},
addToQueue: (track) => set({ queue: [...get().queue, track] }),
removeAt: (idx) => set({ queue: get().queue.filter((_, i) => i !== idx) }),
playAt: (idx) => set({ current: idx, playing: true }),
setPlaying: (p) => set({ playing: p }),
setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
next: () => set((s) => ({ current: Math.min(s.queue.length - 1, s.current + 1), playing: true })),
prev: () => set((s) => ({ current: Math.max(0, s.current - 1), playing: true })),
}));