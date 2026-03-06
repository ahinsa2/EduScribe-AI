"""
models/response_model.py – EduScribe AI
Pydantic response models for structured API output.
"""

from pydantic import BaseModel
from typing import List


class NoteSection(BaseModel):
    """A single titled section of lecture notes."""
    title: str
    points: List[str]


class VideoResponse(BaseModel):
    """Structured response returned by /process-video."""
    status:   str
    url:      str
    title:    str
    summary:  str
    sections: List[NoteSection]
    keywords: List[str]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "success",
                    "url": "https://youtu.be/example",
                    "title": "Introduction to Machine Learning",
                    "summary": "A concise overview of the lecture content.",
                    "sections": [
                        {
                            "title": "Key Concepts",
                            "points": [
                                "Supervised vs unsupervised learning",
                                "Training and test data splits",
                            ]
                        }
                    ],
                    "keywords": ["machine learning", "neural networks"]
                }
            ]
        }
    }