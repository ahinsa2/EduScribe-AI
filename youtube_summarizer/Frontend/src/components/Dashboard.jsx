import { BookOpen, Layers, Target, RotateCcw, X } from "lucide-react";

export default function Dashboard({ stats, accuracy, onReset, onClose, dark }) {
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const label = dark ? "text-slate-500" : "text-slate-400";
  const value = dark ? "text-slate-100" : "text-slate-900";
  const statCard = dark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200";

  const items = [
    {
      icon: <BookOpen size={18} className="text-amber-400" />,
      label: "Videos Studied",
      value: stats.videosStudied,
      suffix: "",
    },
    {
      icon: <Layers size={18} className="text-amber-400" />,
      label: "Flashcards Reviewed",
      value: stats.flashcardsReviewed,
      suffix: "",
    },
    {
      icon: <Target size={18} className="text-amber-400" />,
      label: "Quiz Accuracy",
      value: accuracy !== null ? accuracy : "—",
      suffix: accuracy !== null ? "%" : "",
    },
  ];

  return (
    <div className={`rounded-2xl border p-6 space-y-5 ${card}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-serif text-lg font-bold ${dark ? "text-amber-400" : "text-amber-600"}`}>
          Study Dashboard
        </h3>
        {onClose && (
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-500" : "hover:bg-slate-100 text-slate-400"}`}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className={`rounded-xl border p-4 flex flex-col gap-2 ${statCard}`}>
            {item.icon}
            <p className={`text-2xl font-mono font-bold ${value}`}>
              {item.value}{item.suffix}
            </p>
            <p className={`text-xs leading-tight ${label}`}>{item.label}</p>
          </div>
        ))}
      </div>

      {stats.quizTotal > 0 && (
        <div>
          <div className={`h-2 rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
            <div
              className="h-2 rounded-full bg-amber-400 transition-all duration-700"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <p className={`text-xs mt-1.5 font-mono ${label}`}>
            {stats.quizCorrect} correct out of {stats.quizTotal} questions
          </p>
        </div>
      )}

      <button
        onClick={onReset}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono transition-all ${
          dark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        }`}
      >
        <RotateCcw size={12} /> Reset all stats
      </button>
    </div>
  );
}