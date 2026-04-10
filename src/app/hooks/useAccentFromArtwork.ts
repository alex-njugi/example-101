import { useEffect } from 'react';

function avgColorFromImg(src?: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        const w = c.width = 24, h = c.height = 24;
        const ctx = c.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r=0,g=0,b=0,n=0;
        for (let i=0; i<data.length; i+=4) {
          const a = data[i+3]/255;
          if (a < 0.5) continue; // skip transparent
          r += data[i]; g += data[i+1]; b += data[i+2]; n++;
        }
        if (!n) return resolve(null);
        r = Math.round(r/n); g = Math.round(g/n); b = Math.round(b/n);
        resolve(`rgb(${r} ${g} ${b})`);
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function useAccentFromArtwork(artwork?: string) {
  useEffect(() => {
    let mounted = true;
    avgColorFromImg(artwork).then((rgb) => {
      if (!mounted) return;
      // fallback to our house blue if no artwork
      document.documentElement.style.setProperty('--accent', rgb ?? 'rgb(74 129 255)');
      // softer/glow variants
      document.documentElement.style.setProperty('--accent-10', 'color-mix(in srgb, var(--accent) 10%, transparent)');
      document.documentElement.style.setProperty('--accent-20', 'color-mix(in srgb, var(--accent) 20%, transparent)');
      document.documentElement.style.setProperty('--accent-35', 'color-mix(in srgb, var(--accent) 35%, transparent)');
    });
    return () => { mounted = false; };
  }, [artwork]);
}
