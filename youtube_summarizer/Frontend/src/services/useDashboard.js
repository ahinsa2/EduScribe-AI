import { useState, useEffect } from "react";

const STORAGE_KEY = "lecturelens_dashboard";

const defaults = {
  videosStudied: 0,
  flashcardsReviewed: 0,
  quizTotal: 0,
  quizCorrect: 0,
};

export function useDashboard() {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordVideo = () =>
    setStats((s) => ({ ...s, videosStudied: s.videosStudied + 1 }));

  const recordFlashcard = () =>
    setStats((s) => ({ ...s, flashcardsReviewed: s.flashcardsReviewed + 1 }));

  const recordQuizAnswer = (correct) =>
    setStats((s) => ({
      ...s,
      quizTotal: s.quizTotal + 1,
      quizCorrect: s.quizCorrect + (correct ? 1 : 0),
    }));

  const resetStats = () => setStats(defaults);

  const accuracy =
    stats.quizTotal > 0
      ? Math.round((stats.quizCorrect / stats.quizTotal) * 100)
      : null;

  return { stats, accuracy, recordVideo, recordFlashcard, recordQuizAnswer, resetStats };
}