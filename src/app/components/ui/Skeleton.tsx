export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style>{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}
