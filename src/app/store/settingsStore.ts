import { create } from 'zustand';


export const useSettings = create<{ crossfade: boolean; crossfadeSec: number }>(() => ({
crossfade: false,
crossfadeSec: 3,
}));