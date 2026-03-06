// Generates flashcards from sections/key_points data returned by the backend.
// Falls back to splitting summary into sentences if no structured data.

export function generateFlashcards(data) {
  // If backend returns sections (EduScribe schema)
  if (data.sections && Array.isArray(data.sections)) {
    const cards = [];
    data.sections.forEach((section) => {
      section.points?.forEach((point) => {
        // Turn each bullet into a Q&A by using section title as context
        cards.push({
          question: `What is a key point about "${section.title}"?`,
          answer: point,
        });
      });
    });
    return cards.slice(0, 12);
  }

  // Fallback: split summary into sentence pairs
  if (data.summary) {
    const sentences = data.summary
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.length > 30);
    return sentences.slice(0, 8).map((s, i) => ({
      question: `Key concept #${i + 1} from this lecture:`,
      answer: s,
    }));
  }

  return [];
}

export function generateQuiz(data) {
  // Build quiz from keywords + sections if available
  const questions = [];

  if (data.sections && data.keywords) {
    data.sections.slice(0, 4).forEach((section, idx) => {
      const correctPoint = section.points?.[0];
      if (!correctPoint) return;

      // Grab 3 wrong answers from other sections
      const wrongPoints = data.sections
        .filter((_, i) => i !== idx)
        .flatMap((s) => s.points || [])
        .slice(0, 3);

      if (wrongPoints.length < 3) return;

      const options = shuffle([correctPoint, ...wrongPoints]);
      questions.push({
        question: `Which best describes "${section.title}"?`,
        options,
        correct: correctPoint,
      });
    });
  }

  // Fallback keyword quiz
  if (questions.length < 2 && data.keywords?.length >= 4) {
    const kws = data.keywords;
    questions.push({
      question: `Which of these is a key topic covered in this lecture?`,
      options: shuffle([kws[0], "Quantum mechanics", "Medieval history", "Marine biology"]),
      correct: kws[0],
    });
  }

  return questions.slice(0, 5);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}