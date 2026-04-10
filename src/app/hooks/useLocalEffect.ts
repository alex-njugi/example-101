import { useEffect, useRef } from 'react';
export function useLocalEffect(effect: () => void) {
const once = useRef(false);
useEffect(() => { if (once.current) return; once.current = true; effect(); }, []);
}