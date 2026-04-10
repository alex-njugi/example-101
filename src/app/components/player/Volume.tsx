import { usePlayer } from '../../store/playerStore';
import { Volume2 } from 'lucide-react';

export default function Volume() {
  const { setVolume } = usePlayer();
  return (
    <div className="flex items-center gap-2">
      <Volume2 size={16} className="text-white/80" />
      <input
        type="range" min={0} max={1} step={0.01} defaultValue={1}
        onChange={(e)=>setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
}
