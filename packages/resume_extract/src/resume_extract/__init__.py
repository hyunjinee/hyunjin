"""
resume_extract - A library for extracting information from resumes.

A Python library that extracts information from resume URLs.
Provides structured information extraction using Google's LangExtract.
"""

__version__ = "0.0.1"

from .extractor import ResumeExtractor
from .models import (
    ResumeInfo,
    ContactInfo,
    ExperienceInfo,
    EducationInfo,
    ProjectInfo,
    CertificationInfo,
)
from .exceptions import (
    ResumeExtractError,
    InvalidURLError,
    UnsupportedFileTypeError,
    DownloadError,
    ParseError,
    ExtractionError,
    LangExtractAPIError,
)

# Convenience functions
def extract_from_url(url: str, **kwargs) -> ResumeInfo:
    """
    Convenience function to extract resume information from a URL.
    
    Args:
        url: Resume file URL
        **kwargs: Keyword arguments to pass to ResumeExtractor constructor
        
    Returns:
        ResumeInfo: Extracted resume information
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_url(url)


def extract_from_file(file_path: str, **kwargs) -> ResumeInfo:
    """
    Convenience function to extract resume information from a local file.
    
    Args:
        file_path: Local resume file path
        **kwargs: Keyword arguments to pass to ResumeExtractor constructor
        
    Returns:
        ResumeInfo: Extracted resume information
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_file(file_path)


def extract_from_text(text: str, **kwargs) -> ResumeInfo:
    """
    Convenience function to extract resume information directly from text.
    
    Args:
        text: Resume text content
        **kwargs: Keyword arguments to pass to ResumeExtractor constructor
        
    Returns:
        ResumeInfo: Extracted resume information
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_text(text)


__all__ = [
    "__version__",
    # Main class
    "ResumeExtractor",
    # Models
    "ResumeInfo",
    "ContactInfo",
    "ExperienceInfo",
    "EducationInfo",
    "ProjectInfo",
    "CertificationInfo",
    # Exceptions
    "ResumeExtractError",
    "InvalidURLError",
    "UnsupportedFileTypeError",
    "DownloadError",
    "ParseError",
    "ExtractionError",
    "LangExtractAPIError",
    # Convenience functions
    "extract_from_url",
    "extract_from_file",
    "extract_from_text",
]

