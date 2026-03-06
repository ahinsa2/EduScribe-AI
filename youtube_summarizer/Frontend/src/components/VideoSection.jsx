import { ExternalLink } from "lucide-react";

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export default function VideoSection({ url, title, dark }) {
  const videoId = extractVideoId(url);

  const card = dark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";
  const titleColor = dark ? "text-slate-100" : "text-slate-900";
  const sub = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-lg ${card}`}>
      {videoId && (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <h2 className={`font-serif text-lg font-bold leading-snug ${titleColor}`}>
            {title}
          </h2>
          <p className={`text-xs mt-1 font-mono ${sub}`}>YouTube Lecture</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
          }`}
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}