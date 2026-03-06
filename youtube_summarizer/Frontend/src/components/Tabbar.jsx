export default function TabBar({ tabs, active, onChange, dark }) {
  return (
    <div className={`flex gap-1 p-1 rounded-xl ${dark ? "bg-slate-800/60" : "bg-slate-100"}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            active === tab.id
              ? "bg-amber-400 text-slate-900 shadow-sm"
              : dark
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}