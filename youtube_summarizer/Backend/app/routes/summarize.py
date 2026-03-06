"""
routes/summarize.py – EduScribe AI
POST /process-video endpoint.
Orchestrates: URL validation → transcript extraction → Gemini summarization → response.
"""

from fastapi import APIRouter, HTTPException, status

from app.models.request_model  import VideoRequest
from app.models.response_model import VideoResponse, NoteSection

from app.services.youtube_service import (
    get_transcript,
    InvalidYouTubeURLError,
    TranscriptUnavailableError,
)
from app.services.ai_service import (
    generate_notes_from_transcript,
    GeminiProcessingError,
)
from app.utils.helpers import validate_url

router = APIRouter(tags=["Video Processing"])


@router.post(
    "/process-video",
    response_model=VideoResponse,
    summary="Process a YouTube lecture and return AI-generated structured notes",
    response_description="Structured educational notes with sections and keywords",
)
async def process_video(payload: VideoRequest) -> VideoResponse:
    """
    Full pipeline:
    1. Validate the supplied URL.
    2. Extract the YouTube transcript.
    3. Send the transcript to Gemini for structured summarization.
    4. Return the notes as a typed VideoResponse object.

    - **url**: YouTube video URL (watch, share, embed, or Shorts format)
    """

    # ── Step 1: Basic URL validation ──────────────────────────────────────────
    if not validate_url(payload.url):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Invalid URL. Please supply a full YouTube URL beginning with "
                "http:// or https://."
            ),
        )

    # ── Step 2: Extract transcript ────────────────────────────────────────────
    try:
        transcript = get_transcript(payload.url)

    except InvalidYouTubeURLError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except TranscriptUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Unexpected error while fetching transcript: {exc}",
        ) from exc

    # ── Step 3: Generate notes with Gemini ────────────────────────────────────
    try:
        notes = await generate_notes_from_transcript(transcript)

    except GeminiProcessingError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI processing error: {exc}",
        ) from exc

    except ValueError as exc:
        # Raised if transcript is empty after extraction
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during AI summarization: {exc}",
        ) from exc

    # ── Step 4: Build and return typed response ───────────────────────────────
    return VideoResponse(
        status   = "success",
        url      = payload.url,
        title    = notes["title"],
        summary  = notes["summary"],
        sections = [NoteSection(**s) for s in notes["sections"]],
        keywords = notes["keywords"],
    )