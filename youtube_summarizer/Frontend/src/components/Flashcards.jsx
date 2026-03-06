import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";

export default function Flashcards({ cards, onReview, dark }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(new Set());

  if (!cards || cards.length === 0) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${dark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
        <p className="font-mono text-sm">No flashcards available for this lecture.</p>
      </div>
    );
  }

  const card = cards[index];
  const total = cards.length;

  const go = (dir) => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + dir + total) % total), 150);
  };

  const handleFlip = () => {
    if (!flipped) {
      const next = new Set(reviewed);
      next.add(index);
      setReviewed(next);
      if (!reviewed.has(index)) onReview?.();
    }
    setFlipped((f) => !f);
  };

  const cardBg = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const frontBg = dark ? "bg-slate-800" : "bg-amber-50";
  const backBg = dark ? "bg-amber-400/10 border-amber-400/20" : "bg-amber-50 border-amber-200";
  const label = dark ? "text-slate-500" : "text-slate-400";
  const btnBase = `p-2 rounded-xl transition-all ${dark ? "hover:bg-slate-800 text-slate-400 hover:text-amber-400" : "hover:bg-slate-100 text-slate-500 hover:text-amber-600"}`;

  return (
    <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className={dark ? "text-amber-400" : "text-amber-600"} />
          <h3 className={`font-serif text-lg font-bold ${dark ? "text-amber-400" : "text-amber-600"}`}>Flashcards</h3>
        </div>
        <span className={`font-mono text-xs ${label}`}>{reviewed.size}/{total} reviewed</span>
      </div>

      {/* Progress bar */}
      <div className={`h-1 rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div
          className="h-1 rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <div
          className="relative transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "200px",
          }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 text-center border ${frontBg} ${dark ? "border-slate-700" : "border-amber-100"}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${label}`}>Question</p>
            <p className={`font-serif text-lg leading-snug ${dark ? "text-slate-200" : "text-slate-800"}`}>
              {card.question}
            </p>
            <p className={`mt-4 text-xs font-mono ${label}`}>tap to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 text-center border ${backBg}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${dark ? "text-amber-400" : "text-amber-600"}`}>Answer</p>
            <p className={`text-base leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button onClick={() => go(-1)} className={btnBase}>
          <ChevronLeft size={20} />
        </button>
        <span className={`font-mono text-sm ${label}`}>{index + 1} / {total}</span>
        <button onClick={() => go(1)} className={btnBase}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setIndex(0); setFlipped(false); setReviewed(new Set()); }}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono transition-all ${
          dark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        }`}
      >
        <RotateCcw size={12} /> Reset deck
      </button>
    </div>
  );
}