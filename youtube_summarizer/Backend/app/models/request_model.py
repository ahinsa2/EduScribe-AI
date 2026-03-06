"""
models/request_model.py – EduScribe AI
Pydantic request models for input validation.
"""

from pydantic import BaseModel, HttpUrl, field_validator


class VideoRequest(BaseModel):
    """Request body for the /process-video endpoint."""

    url: str

    @field_validator("url")
    @classmethod
    def url_must_not_be_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("url must not be empty.")
        return value

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"url": "https://www.youtube.com/watch?v=example"}
            ]
        }
    }