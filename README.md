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
-------------------------------------------------------------------------
3.Project Architecture
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│        HTML / CSS / JavaScript  (port 5173)                 │
│                                                             │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Home    │  │  Summary  │  │Flashcards│  │   Quiz   │    │
│  │  Input   │  │  Viewer   │  │   Mode   │  │   Mode   │    │
│  └──────────┘  └───────────┘  └──────────┘  └──────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │  POST /summarize
                        │  { "youtube_url": "..." }
┌───────────────────────▼─────────────────────────────────────┐
│                        BACKEND                              │
│              FastAPI + Uvicorn  (port 8000)                 │
│                                                             │
│  ┌─────────────────┐    ┌──────────────────────────────┐    │
│  │  youtube_service│    │         ai_service           │    │
│  │  Extract video  │──> │  Send transcript to Gemini   │    │
│  │  ID + transcript│    │  Parse structured JSON output│    │
│  └─────────────────┘    └──────────────────────────────┘    │
│                                      │                      │
└──────────────────────────────────────┼──────────────────────┘
                                       │
              ┌────────────────────────▼──────────────────────┐
              │             Google Gemini API                 │
              │           gemini-2.5-flash-lite               │
              └───────────────────────────────────────────────┘

----------------------------------------------------------------------------

4.📁 Folder Structure
EduScribe-AI/
│
├── Backend/
│   └── app/
│       ├── main.py                  # FastAPI application entry point
│       ├── routes/
│       │   └── summarize.py         # POST /summarize route handler
│       ├── services/
│       │   ├── ai_service.py        # Gemini API prompt + response parsing
│       │   └── youtube_service.py   # Video ID extraction + transcript fetch
│       ├── models/
│       │   ├── request_model.py     # Pydantic input schema
│       │   └── response_model.py    # Pydantic output schema
│       └── core/
│           └── settings.py          # Environment and app configuration
│
├── frontend/
│   ├── index.html                   # App shell and layout
│   ├── style.css                    # Global styles, dark mode, animations
│   ├── script.js                    # UI logic, tab switching, flashcard state
│   └── services/
│       └── api.js                   # fetch() wrapper for /summarize
│
├── .env.example                     # Environment variable template
├── requirements.txt                 # Python package dependencies
└── README.md
-------------------------------------------------------
5.🚀 Installation Guide
A.Prerequisites

Python 3.10+ installed
A Google Gemini API key — get one free at ai.google.dev
A modern browser (Chrome, Firefox, or Edge)


B.Backend Setup
1. Clone the repository
bashgit clone https://github.com/your-username/eduscribe-ai.git
cd eduscribe-ai
2. Create and activate a virtual environment
bash# macOS / Linux
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
3. Install Python dependencies
bashpip install -r requirements.txt
4. Configure environment variables
bashcp .env.example .env
# Open .env and paste in your GEMINI_API_KEY
5. Start the backend server
bashuvicorn app.main:app --reload
✅ API running at http://localhost:8000
📖 Interactive docs at http://localhost:8000/docs

C.Frontend Setup
The frontend is a static site — no build step or package manager required.
Option A — Open directly in browser
bashopen frontend/index.html
Option B — Serve locally (recommended)
bashcd frontend
python -m http.server 5500
# Open http://localhost:5500

Make sure the backend is running on port 8000 before submitting a URL.


D. Environment Variables
Create a .env file inside the Backend/ directory:
env# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# App
DEBUG=false
VariableRequiredDescriptionGEMINI_API_KEY✅ YesYour Google Gemini API keyGEMINI_MODELNoModel to use (default: gemini-2.0-flash)DEBUGNoEnable FastAPI debug output (default: false)

🔒 Never commit your .env file. It is excluded via .gitignore.


E. API Endpoint
POST /summarize
Accepts a YouTube URL and returns a full structured study package.
Request
httpPOST http://localhost:8000/summarize
Content-Type: application/json
json{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
Response — 200 OK
json{
  "title": "string",
  "summary": "string",
  "sections": [
    {
      "title": "string",
      "points": ["string", "string"]
    }
  ],
  "keywords": ["string", "string"]
}
--------------------------------------------
6.Error Codes
CodeMeaning400Invalid or missing YouTube URL422Request body failed schema validation500Transcript could not be fetched or AI processing failed502Gemini API quota exceeded or upstream error
--------------------------------------------
7.🔮 Future Improvements

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
