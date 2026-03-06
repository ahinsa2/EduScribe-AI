"""
services/ai_service.py – EduScribe AI
AI summarization layer using Google Gemini.
Accepts a plain-text transcript and returns structured lecture notes.
No route logic. No YouTube/transcript fetching.
"""

import os
import json
import re
import textwrap

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ── Gemini Configuration ───────────────────────────────────────────────────────

_GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
_GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

if not _GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. "
        "Add it to your .env file or set it as an environment variable."
    )

genai.configure(api_key=_GEMINI_API_KEY)

_model = genai.GenerativeModel(
    model_name=_GEMINI_MODEL,
    generation_config=genai.types.GenerationConfig(
        temperature=0.4,       # Low temperature for factual, consistent output
        top_p=0.9,
        max_output_tokens=4096,
    ),
)

# ── Custom Exception ───────────────────────────────────────────────────────────

class GeminiProcessingError(RuntimeError):
    """Raised when Gemini fails to return valid structured notes."""


# ── Prompt Template ────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = textwrap.dedent("""
    You are an expert academic note-taker and educational content specialist.
    Your task is to convert a raw lecture transcript into clean, structured study notes.

    STRICT OUTPUT RULES:
    - Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation.
    - Do not wrap the JSON in ```json``` or any other formatting.
    - All string values must be properly escaped.
    - The JSON must exactly match this schema:

    {
      "title": "A concise, descriptive title for the lecture (max 12 words)",
      "summary": "A 3-5 sentence paragraph summarising the entire lecture clearly and academically.",
      "sections": [
        {
          "title": "Section heading (e.g. Key Concepts, Methodology, Applications)",
          "points": [
            "Clear, self-contained bullet point (full sentence, no truncation)",
            "..."
          ]
        }
      ],
      "keywords": ["keyword1", "keyword2", "keyword3", "..."]
    }

    CONTENT RULES:
    - Create between 4 and 7 sections. Choose headings that reflect the actual content.
    - Each section must have between 3 and 8 bullet points.
    - Each bullet point must be a complete, self-contained sentence (not a fragment).
    - keywords must be a flat list of 6-12 single or two-word topic terms.
    - Do not invent facts. Only use information present in the transcript.
    - Write in clear, formal academic English.
""").strip()


# ── Transcript Chunking ────────────────────────────────────────────────────────

_MAX_TRANSCRIPT_CHARS = 28_000  # ~7 000 tokens — safe for gemini-2.5-flash-lite context


def _truncate_transcript(transcript: str) -> str:
    """
    Trim the transcript to a safe context length.
    Cuts at the nearest sentence boundary where possible.
    """
    if len(transcript) <= _MAX_TRANSCRIPT_CHARS:
        return transcript

    truncated = transcript[:_MAX_TRANSCRIPT_CHARS]
    last_period = truncated.rfind(". ")
    if last_period > _MAX_TRANSCRIPT_CHARS * 0.8:
        truncated = truncated[: last_period + 1]

    return truncated + "\n\n[Transcript truncated for processing]"


# ── JSON Parsing ───────────────────────────────────────────────────────────────

def _parse_gemini_response(raw_text: str) -> dict:
    """
    Robustly extract and validate the JSON object from Gemini's response.

    Handles cases where the model wraps the JSON in markdown fences despite
    instructions not to.

    Args:
        raw_text: Raw string returned by Gemini.

    Returns:
        Validated dict with keys: title, summary, sections, keywords.

    Raises:
        GeminiProcessingError: If valid JSON matching the schema cannot be found.
    """
    text = raw_text.strip()

    # Strip markdown code fences if present (defensive)
    fence_match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
    if fence_match:
        text = fence_match.group(1).strip()

    # Attempt to parse the cleaned text directly
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        # Last resort: find the first {...} block in the response
        brace_match = re.search(r"\{[\s\S]+\}", text)
        if not brace_match:
            raise GeminiProcessingError(
                "Gemini returned a response that does not contain a JSON object. "
                f"Raw response (first 300 chars): {raw_text[:300]!r}"
            )
        try:
            data = json.loads(brace_match.group())
        except json.JSONDecodeError as exc:
            raise GeminiProcessingError(
                f"Failed to parse JSON from Gemini response: {exc}. "
                f"Raw response (first 300 chars): {raw_text[:300]!r}"
            ) from exc

    # Validate required top-level keys
    required_keys = {"title", "summary", "sections", "keywords"}
    missing = required_keys - data.keys()
    if missing:
        raise GeminiProcessingError(
            f"Gemini response is missing required keys: {missing}. "
            f"Keys present: {list(data.keys())}"
        )

    if not isinstance(data["sections"], list) or not data["sections"]:
        raise GeminiProcessingError(
            "Gemini response 'sections' must be a non-empty list."
        )

    if not isinstance(data["keywords"], list):
        raise GeminiProcessingError(
            "Gemini response 'keywords' must be a list."
        )

    return data


# ── Public Interface ───────────────────────────────────────────────────────────

async def generate_notes_from_transcript(transcript: str) -> dict:
    """
    Send a lecture transcript to Gemini and return structured notes.

    Args:
        transcript: Full plain-text transcript of the lecture.

    Returns:
        Dict with keys: title, summary, sections (list of {title, points}), keywords.

    Raises:
        GeminiProcessingError: On API errors or malformed responses.
        ValueError:            If the transcript is empty.
    """
    if not transcript or not transcript.strip():
        raise ValueError("Transcript must not be empty.")

    safe_transcript = _truncate_transcript(transcript)

    user_message = (
        f"Please convert the following lecture transcript into structured study notes.\n\n"
        f"TRANSCRIPT:\n{safe_transcript}"
    )

    try:
        response = _model.generate_content(
            [_SYSTEM_PROMPT, user_message]
        )
    except Exception as exc:
        raise GeminiProcessingError(
            f"Gemini API call failed: {exc}"
        ) from exc

    if not response.text:
        raise GeminiProcessingError(
            "Gemini returned an empty response. "
            "The transcript may have triggered a content safety filter."
        )

    return _parse_gemini_response(response.text)