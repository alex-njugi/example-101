import { Link } from 'react-router-dom';


export default function ArtistCard({ name, image }: { name: string; image?: string }) {
const href = `/artist/${encodeURIComponent(name)}`;
return (
<Link to={href} className="card card-hover p-3 block text-center">
{image ? (
<img src={image} className="w-24 h-24 mx-auto rounded-full object-cover" />
) : (
<div className="w-24 h-24 mx-auto rounded-full bg-white/10" />)
}
<div className="mt-2 font-medium truncate">{name}</div>
</Link>
);
}