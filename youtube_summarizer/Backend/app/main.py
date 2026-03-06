"""
app/main.py – EduScribe AI
FastAPI application entry point.
"""

import sys
import os

# Ensure the project root is on sys.path when running via uvicorn from any directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.summarize import router as summarize_router

# ── Application ────────────────────────────────────────────
app = FastAPI(
    title="EduScribe AI",
    description="AI Powered Lecture Notes Generator",
    version="1.0.0",
)

# ── CORS (allow all origins for development) ───────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────
app.include_router(summarize_router)


# ── Health check ───────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "EduScribe AI"}


# ── Entry point ────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)