import { Moon, Sun, BookOpen, LayoutDashboard } from "lucide-react";

export default function Navbar({ dark, setDark, onDashboard }) {
  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${
      dark
        ? "bg-slate-950/80 border-slate-800 text-slate-100"
        : "bg-white/80 border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
            <BookOpen size={14} className="text-slate-900" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">
            Edu<span className="text-amber-400">Scribe</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDashboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              dark
                ? "hover:bg-slate-800 text-slate-300 hover:text-amber-400"
                : "hover:bg-slate-100 text-slate-600 hover:text-amber-600"
            }`}
          >
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg transition-all ${
              dark
                ? "hover:bg-slate-800 text-amber-400"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}