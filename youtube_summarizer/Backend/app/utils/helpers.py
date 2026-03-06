"""
utils/helpers.py – EduScribe AI
General-purpose utility functions shared across the application.
"""

from urllib.parse import urlparse


def validate_url(url: str) -> bool:
    """
    Perform a basic structural validation on a URL string.

    Checks that the URL:
    - Is a non-empty string
    - Uses the http or https scheme
    - Contains a non-empty network location (hostname)

    Args:
        url: The URL string to validate.

    Returns:
        True if the URL passes all basic checks, False otherwise.
    """
    if not url or not isinstance(url, str):
        return False

    url = url.strip()

    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def sanitize_url(url: str) -> str:
    """
    Strip leading/trailing whitespace from a URL string.

    Args:
        url: Raw URL string.

    Returns:
        Sanitized URL string.
    """
    return url.strip() if isinstance(url, str) else ""


def truncate_text(text: str, max_length: int = 500, suffix: str = "...") -> str:
    """
    Truncate a string to a maximum character length, appending a suffix if cut.

    Args:
        text:       The input string to truncate.
        max_length: Maximum number of characters to retain (default 500).
        suffix:     String appended when truncation occurs (default "...").

    Returns:
        The original string if within limit, otherwise a truncated version.
    """
    if not text or len(text) <= max_length:
        return text
    return text[:max_length].rstrip() + suffix