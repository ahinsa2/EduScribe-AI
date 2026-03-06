import { useState } from "react";
import { Youtube, Sparkles, ArrowRight } from "lucide-react";

export default function HomeInput({ onSubmit, loading, dark }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = url.trim();
    if (!trimmed) return setError("Please enter a YouTube URL.");
    if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
      return setError("That doesn't look like a YouTube URL.");
    }
    onSubmit(trimmed);
  };

  const base = dark ? "text-slate-100" : "text-slate-900";
  const sub = dark ? "text-slate-400" : "text-slate-500";
  const inputBg = dark
    ? "bg-slate-800/60 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-400"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500";

  return (
    <div className="flex flex-col items-center text-center py-16 px-4 max-w-2xl mx-auto">
      {/* Badge */}
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-6 ${
        dark ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-amber-50 text-amber-600 border border-amber-200"
      }`}>
        <Sparkles size={11} />
        AI-Powered Study Assistant
      </div>

      {/* Headline */}
      <h1 className={`font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4 ${base}`}>
        Turn any lecture into
        <br />
        <span className="text-amber-400">structured notes</span>
      </h1>
      <p className={`text-base sm:text-lg mb-10 max-w-md leading-relaxed ${sub}`}>
        Paste a YouTube lecture URL. Get a summary, flashcards, and a quiz — instantly.
      </p>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
          dark ? "bg-slate-800/40 border-slate-700" : "bg-slate-50 border-slate-200"
        }`}>
          <div className={`pl-2 ${sub}`}>
            <Youtube size={20} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="https://youtube.com/watch?v=..."
            disabled={loading}
            className={`flex-1 bg-transparent text-sm outline-none py-2 px-1 ${inputBg.split(" border")[0]}`}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-900 font-semibold text-sm hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
          >
            {loading ? "Working…" : (
              <>Generate <ArrowRight size={14} /></>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-red-400 text-sm font-mono">{error}</p>
        )}
      </form>

      {/* Example hint */}
      <p className={`mt-5 text-xs ${sub}`}>
        Works with any public YouTube lecture, talk, or tutorial.
      </p>
    </div>
  );
}