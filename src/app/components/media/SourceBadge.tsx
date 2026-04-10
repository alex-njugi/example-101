export default function SourceBadge({ source }: { source: 'audius'|'jamendo' }) {
return <span className={`badge ${source==='audius' ? 'bg-indigo-500/20' : 'bg-pink-500/20'}`}>{source}</span>;
}