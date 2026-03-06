import { useState } from "react";
import { FileText, Layers, HelpCircle, RefreshCw } from "lucide-react";
import VideoSection from "../components/VideoSection";
import SummarySection from "../components/SummarySection";
import Flashcards from "../components/Flashcards";
import Quiz from "../components/Quiz";
import TabBar from "../components/TabBar";
import { generateFlashcards, generateQuiz } from "../services/studyUtils";

const TABS = [
  { id: "summary", label: "Summary", icon: <FileText size={14} /> },
  { id: "flashcards", label: "Flashcards", icon: <Layers size={14} /> },
  { id: "quiz", label: "Quiz", icon: <HelpCircle size={14} /> },
];

export default function ResultsPage({ data, url, onReset, onFlashcard, onQuizAnswer, dark }) {
  const [tab, setTab] = useState("summary");

  const flashcards = generateFlashcards(data);
  const quiz = generateQuiz(data);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Video */}
      <VideoSection url={url} title={data.title} dark={dark} />

      {/* Tab bar */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} dark={dark} />

      {/* Tab content */}
      {tab === "summary" && <SummarySection data={data} dark={dark} />}
      {tab === "flashcards" && (
        <Flashcards cards={flashcards} onReview={onFlashcard} dark={dark} />
      )}
      {tab === "quiz" && (
        <Quiz questions={quiz} onAnswer={onQuizAnswer} dark={dark} />
      )}

      {/* Start over */}
      <button
        onClick={onReset}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-mono transition-all ${
          dark
            ? "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
            : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
        }`}
      >
        <RefreshCw size={14} /> Analyse another lecture
      </button>
    </div>
  );
}