import { useState } from "react";
import Navbar from "./components/Navbar";
import HomeInput from "./components/HomeInput";
import Loader from "./components/Loader";
import Dashboard from "./components/Dashboard";
import ResultsPage from "./pages/ResultsPage";
import { summarizeVideo } from "./services/api";
import { useDashboard } from "./services/useDashboard";

export default function App() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [url, setUrl] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  const { stats, accuracy, recordVideo, recordFlashcard, recordQuizAnswer, resetStats } =
    useDashboard();

  const handleSubmit = async (youtubeUrl) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const result = await summarizeVideo(youtubeUrl);
      setData(result);
      setUrl(youtubeUrl);
      recordVideo();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setUrl("");
    setError("");
  };

  const bg = dark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  return (
    <div className={bg}>
      <Navbar dark={dark} setDark={setDark} onDashboard={() => setShowDashboard((s) => !s)} />

      {/* Dashboard overlay */}
      {showDashboard && (
        <div className="max-w-xl mx-auto px-4 pt-6">
          <Dashboard
            stats={stats}
            accuracy={accuracy}
            onReset={resetStats}
            onClose={() => setShowDashboard(false)}
            dark={dark}
          />
        </div>
      )}

      {/* Main content */}
      {!data && !loading && (
        <>
          <HomeInput onSubmit={handleSubmit} loading={loading} dark={dark} />
          {error && (
            <div className="max-w-xl mx-auto px-4 pb-8">
              <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-red-300 text-sm font-mono">
                ⚠ {error}
              </div>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="max-w-xl mx-auto px-4">
          <Loader message="Fetching transcript & generating notes…" />
        </div>
      )}

      {data && !loading && (
        <ResultsPage
          data={data}
          url={url}
          onReset={handleReset}
          onFlashcard={recordFlashcard}
          onQuizAnswer={recordQuizAnswer}
          dark={dark}
        />
      )}

      {/* Footer */}
      {!data && !loading && (
        <footer className={`text-center py-8 text-xs font-mono ${dark ? "text-slate-700" : "text-slate-400"}`}>
          EduScribe · By HackMates
        </footer>
      )}
    </div>
  );
}
