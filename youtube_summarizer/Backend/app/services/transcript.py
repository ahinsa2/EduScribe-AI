"""
services/transcript.py – EduScribe AI
Transcript extraction service.
Replace the placeholder with a real implementation (e.g. yt-dlp + Whisper).
"""


async def extract_transcript(url: str) -> str:
    """
    Extract a spoken-word transcript from a lecture video URL.

    Currently returns a dummy transcript string for development purposes.
    Replace the body with real logic (e.g. yt-dlp audio download + OpenAI
    Whisper transcription) once the integration is ready.

    Args:
        url: Publicly accessible video URL.

    Returns:
        A string containing the full transcript of the video.
    """
    # TODO: Implement real transcript extraction
    # Suggested approach:
    #   1. Download audio with yt-dlp
    #   2. Transcribe with OpenAI Whisper or a similar ASR model
    #   3. Return the raw transcript text

    return (
        f"[Placeholder transcript for: {url}] "
        "This is a dummy transcript generated for development and testing. "
        "In a production environment this text would contain the full spoken "
        "content of the lecture, extracted via automatic speech recognition. "
        "Topics covered include foundational concepts, theoretical frameworks, "
        "practical applications, and case studies relevant to the subject area."
    )