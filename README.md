# EduScribe AI — AI-Powered YouTube Study Assistant

1. Project Overview
EduScribe AI is a full-stack AI-powered study tool designed for students. It takes any YouTube educational video, extracts its transcript, and uses Google's Gemini AI to transform it into a complete set of structured learning materials — all within seconds.
No more rewatching long lectures or taking scattered notes. EduScribe organises knowledge into clean summaries, section-wise breakdowns, flashcards, and self-test quizzes so students can study smarter.

2. Tech Stack
Frontend

HTML5 — Semantic markup and page structure
CSS3 — Styling, animations, and responsive layout
JavaScript (ES6+) — Application logic, state management, and API integration

Backend

Python 3.10+ — Core application language
FastAPI — High-performance REST API framework with automatic Swagger docs
Uvicorn — Lightning-fast ASGI server

AI & Data

Google Gemini API (gemini-2.0-flash) — Structured lecture note generation
youtube-transcript-api — Automatic transcript extraction from any public YouTube video

Utilities

Pydantic — Request and response schema validation
python-dotenv — Secure environment variable management

3. Future Improvements

 PDF Export — Download a fully formatted study guide as a PDF
 Playlist Support — Process an entire YouTube course or playlist at once
 AI Study Planner — Automatically schedule revision sessions based on content volume
 Spaced Repetition Flashcards — Smart scheduling that resurfaces cards you find difficult more often
 User Accounts — Save, organise, and revisit past study sessions
 Chrome Extension — Summarise directly from any YouTube tab without switching apps
 Multi-language Support — Generate notes in languages other than English
 Notion / Obsidian Export — Push notes directly into your existing knowledge base
 Collaborative Study Rooms — Share a study pack with classmates via a link
 Voice Playback — Listen to your summary read aloud using text-to-speech
