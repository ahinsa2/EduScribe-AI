import { FileText, Tag } from "lucide-react";

export default function SummarySection({ data, dark }) {
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const heading = dark ? "text-amber-400" : "text-amber-600";
  const body = dark ? "text-slate-300" : "text-slate-700";
  const sectionTitle = dark ? "text-slate-200" : "text-slate-800";
  const bullet = dark ? "text-slate-400" : "text-slate-600";
  const tagBg = dark ? "bg-slate-800 text-amber-400 border-slate-700" : "bg-amber-50 text-amber-700 border-amber-200";
  const sectionBg = dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200";

  return (
    <div className={`rounded-2xl border p-6 shadow-lg space-y-6 ${card}`}>
      {/* Summary */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className={heading} />
          <h3 className={`font-serif text-lg font-bold ${heading}`}>Summary</h3>
        </div>
        <p className={`text-base leading-relaxed ${body}`}>{data.summary}</p>
      </div>

      {/* Sections / Key Points */}
      {data.sections && data.sections.length > 0 && (
        <div className="space-y-4">
          <h3 className={`font-serif text-base font-semibold ${sectionTitle}`}>Key Points by Section</h3>
          {data.sections.map((section, i) => (
            <div key={i} className={`rounded-xl border p-4 ${sectionBg}`}>
              <h4 className={`font-mono text-xs uppercase tracking-widest mb-2 ${heading}`}>
                {section.title}
              </h4>
              <ul className="space-y-1.5">
                {section.points?.map((point, j) => (
                  <li key={j} className={`flex gap-2 text-sm leading-relaxed ${bullet}`}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Keywords */}
      {data.keywords && data.keywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className={heading} />
            <h3 className={`font-mono text-xs uppercase tracking-widest ${heading}`}>Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((kw, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-mono border ${tagBg}`}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}