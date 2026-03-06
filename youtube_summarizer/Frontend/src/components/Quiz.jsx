import { useState } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw, HelpCircle } from "lucide-react";

export default function Quiz({ questions, onAnswer, dark }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  if (!questions || questions.length === 0) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${dark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
        <p className="font-mono text-sm">Not enough content to generate quiz questions.</p>
      </div>
    );
  }

  const q = questions[current];
  const total = questions.length;

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === q.correct;
    if (correct) setScore((s) => s + 1);
    onAnswer?.(correct);
    setHistory((h) => [...h, { question: q.question, chosen: option, correct: q.correct, isCorrect: correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const reset = () => {
    setCurrent(0); setSelected(null); setAnswered(false);
    setScore(0); setDone(false); setHistory([]);
  };

  const cardBg = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const pct = Math.round((score / total) * 100);

  // Done screen
  if (done) {
    return (
      <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
        <div className="text-center py-4">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
            pct >= 70 ? "bg-amber-400/20" : "bg-slate-700/40"
          }`}>
            <Trophy size={28} className={pct >= 70 ? "text-amber-400" : (dark ? "text-slate-500" : "text-slate-400")} />
          </div>
          <h3 className={`font-serif text-2xl font-bold mb-1 ${dark ? "text-slate-100" : "text-slate-900"}`}>
            {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort!" : "Keep studying!"}
          </h3>
          <p className={`text-4xl font-mono font-bold mt-2 ${pct >= 70 ? "text-amber-400" : (dark ? "text-slate-400" : "text-slate-600")}`}>
            {score}/{total}
          </p>
          <p className={`text-sm mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{pct}% accuracy</p>
        </div>

        {/* Review */}
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
              h.isCorrect
                ? dark ? "bg-emerald-900/20 border border-emerald-800/40" : "bg-emerald-50 border border-emerald-200"
                : dark ? "bg-red-900/20 border border-red-800/40" : "bg-red-50 border border-red-200"
            }`}>
              {h.isCorrect
                ? <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                : <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className={dark ? "text-slate-300" : "text-slate-700"}>{h.question}</p>
                {!h.isCorrect && (
                  <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-500"}`}>
                    Correct: <span className="text-emerald-400">{h.correct}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-900 font-semibold text-sm hover:bg-amber-300 transition-all">
          <RotateCcw size={14} /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className={dark ? "text-amber-400" : "text-amber-600"} />
          <h3 className={`font-serif text-lg font-bold ${dark ? "text-amber-400" : "text-amber-600"}`}>Quiz</h3>
        </div>
        <span className={`font-mono text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
          {current + 1}/{total} · Score: {score}
        </span>
      </div>

      {/* Progress */}
      <div className={`h-1 rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className="h-1 rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }} />
      </div>

      {/* Question */}
      <div className={`rounded-xl p-4 ${dark ? "bg-slate-800/60" : "bg-slate-50"}`}>
        <p className={`font-serif text-base leading-snug ${dark ? "text-slate-200" : "text-slate-800"}`}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.correct;
          const isSelected = opt === selected;
          let style = dark
            ? "border-slate-700 hover:border-amber-400/50 hover:bg-slate-800 text-slate-300"
            : "border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700";

          if (answered) {
            if (isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
            else if (isSelected) style = "border-red-500 bg-red-500/10 text-red-300";
            else style = dark ? "border-slate-800 text-slate-600" : "border-slate-100 text-slate-400";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={answered}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${style} disabled:cursor-default`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />}
              {answered && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-900 font-semibold text-sm hover:bg-amber-300 transition-all"
        >
          {current + 1 >= total ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}