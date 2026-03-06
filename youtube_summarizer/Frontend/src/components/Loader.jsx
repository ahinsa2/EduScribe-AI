export default function Loader({ message = "Analysing lecture…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-amber-300/60 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
      </div>
      <p className="text-amber-300/80 font-mono text-sm tracking-widest uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
}