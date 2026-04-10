import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';


export function TopBar() {
const nav = useNavigate();
const loc = useLocation();
const [q, setQ] = useState('');


return (
<div className="flex items-center gap-3 p-3 md:p-4 border-b border-white/10">
<div className="hidden md:flex gap-2">
<button onClick={() => nav(-1)} className="btn rounded-full bg-white/10 px-3 py-1">←</button>
<button onClick={() => nav(1)} className="btn rounded-full bg-white/10 px-3 py-1">→</button>
</div>
<form onSubmit={(e)=>{e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`)}} className="flex-1">
<input
value={q}
onChange={(e)=>setQ(e.target.value)}
placeholder="Search for something"
className="w-full bg-white/10 rounded-xl px-4 py-2 outline-none focus:ring focus:ring-brand-500/40"
/>
</form>
<div className="hidden md:block text-sm text-white/60">{loc.pathname}</div>
</div>
);
}