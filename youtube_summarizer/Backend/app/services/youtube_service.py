"""
services/youtube_service.py – EduScribe AI
Responsible solely for YouTube transcript extraction.
No AI logic. No route logic.

Compatible with youtube-transcript-api v1.x and v2.x.
Breaking change in v1.0.0: static methods removed; use instance methods instead.
  OLD (v0.6.x): YouTubeTranscriptApi.list_transcripts(video_id)
  NEW (v1.x+):  YouTubeTranscriptApi().list(video_id)
"""

import re
from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi

# ── Exception compatibility shim ───────────────────────────────────────────────
# Exceptions were moved in v1.x; try both locations.
try:
    from youtube_transcript_api._errors import (
        NoTranscriptFound,
        TranscriptsDisabled,
        VideoUnavailable,
    )
except ImportError:
    try:
        from youtube_transcript_api import (        # type: ignore[attr-defined]
            NoTranscriptFound,
            TranscriptsDisabled,
            VideoUnavailable,
        )
    except ImportError:
        class NoTranscriptFound(Exception): pass    # type: ignore[no-redef]
        class TranscriptsDisabled(Exception): pass  # type: ignore[no-redef]
        class VideoUnavailable(Exception): pass     # type: ignore[no-redef]


# ── Custom Exceptions ──────────────────────────────────────────────────────────

class InvalidYouTubeURLError(ValueError):
    """Raised when the supplied URL cannot be resolved to a YouTube video ID."""


class TranscriptUnavailableError(RuntimeError):
    """Raised when no transcript can be fetched for the given video."""


# ── Shared API instance ────────────────────────────────────────────────────────
# v1.x+ requires an instance; creating once at module level is safe.
import os
_COOKIES = os.path.join(os.path.dirname(__file__), "cookies.txt")
_ytt = YouTubeTranscriptApi(cookie_path=_COOKIES)


# ── Video ID Extraction ────────────────────────────────────────────────────────

def extract_video_id(url: str) -> str:
    """
    Parse a YouTube URL and return its 11-character video ID.

    Supports all common YouTube URL formats:
      - https://www.youtube.com/watch?v=VIDEO_ID
      - https://youtu.be/VIDEO_ID
      - https://www.youtube.com/embed/VIDEO_ID
      - https://www.youtube.com/shorts/VIDEO_ID
      - URLs with extra query parameters (si=, t=, etc.)

    Args:
        url: Raw YouTube URL string.

    Returns:
        11-character video ID string.

    Raises:
        InvalidYouTubeURLError: If no valid video ID can be extracted.
    """
    url = url.strip()

    if not url:
        raise InvalidYouTubeURLError("URL must not be empty.")

    # youtu.be short links
    short_match = re.match(
        r"(?:https?://)?youtu\.be/([A-Za-z0-9_-]{11})", url
    )
    if short_match:
        return short_match.group(1)

    try:
        parsed   = urlparse(url)
        hostname = parsed.hostname or ""

        if hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
            # /watch?v=VIDEO_ID
            if parsed.path == "/watch":
                params    = parse_qs(parsed.query)
                video_ids = params.get("v", [])
                if video_ids:
                    return _validate_video_id(video_ids[0])

            # /embed/VIDEO_ID  /shorts/VIDEO_ID  /v/VIDEO_ID
            path_match = re.match(
                r"^/(?:embed|shorts|v)/([A-Za-z0-9_-]{11})", parsed.path
            )
            if path_match:
                return _validate_video_id(path_match.group(1))

    except InvalidYouTubeURLError:
        raise
    except Exception:
        pass

    raise InvalidYouTubeURLError(
        f"Could not extract a YouTube video ID from: {url!r}. "
        "Please supply a valid YouTube watch, share, embed, or Shorts URL."
    )


def _validate_video_id(video_id: str) -> str:
    """Confirm the extracted string matches YouTube's 11-character ID format."""
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
        return video_id
    raise InvalidYouTubeURLError(
        f"Extracted value {video_id!r} does not match the YouTube video ID format."
    )


# ── Transcript Fetching ────────────────────────────────────────────────────────

def _snippets_to_text(fetched) -> str:
    """
    Join transcript snippets into a single string.

    Handles both v1.x FetchedTranscript (objects with .text attribute)
    and plain list-of-dicts from older builds.
    """
    parts = []
    for snippet in fetched:
        if isinstance(snippet, dict):
            parts.append(snippet.get("text", ""))
        else:
            parts.append(getattr(snippet, "text", "") or "")
    return " ".join(parts).strip()


def get_transcript(url: str) -> str:
    """
    Extract the full spoken transcript from a YouTube video URL.

    Priority order:
      1. Manually created English transcript
      2. Auto-generated English transcript
      3. First available transcript in any language

    Args:
        url: YouTube video URL.

    Returns:
        Full transcript as a single concatenated string.

    Raises:
        InvalidYouTubeURLError:     If the URL cannot be parsed.
        TranscriptUnavailableError: If no transcript is available for the video.
    """
    video_id = extract_video_id(url)

    try:
        # ── v1.x / v2.x: instance method .list() ──────────────────────────────
        transcript_list = _ytt.list(video_id)

        # find_transcript() prefers manually created over auto-generated
        # and accepts a priority list of language codes.
        try:
            transcript = transcript_list.find_transcript(["en"])
        except NoTranscriptFound:
            # Fall back to the first available language
            transcript = next(iter(transcript_list))

        fetched   = transcript.fetch()
        full_text = _snippets_to_text(fetched)

        if not full_text:
            raise TranscriptUnavailableError(
                f"Transcript for video '{video_id}' was fetched but contained no text."
            )

        return full_text

    except TranscriptsDisabled:
        raise TranscriptUnavailableError(
            f"Transcripts are disabled for video '{video_id}'. "
            "The video owner has turned off captions."
        )
    except VideoUnavailable:
        raise TranscriptUnavailableError(
            f"Video '{video_id}' is unavailable. "
            "It may be private, deleted, or region-restricted."
        )
    except (InvalidYouTubeURLError, TranscriptUnavailableError):
        raise
    except Exception as exc:
        raise TranscriptUnavailableError(
            f"Failed to fetch transcript for video '{video_id}': {exc}"
        ) from exc
    