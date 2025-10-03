"""
Resume Extract - A library for extracting information from resumes.

이력서 URL을 입력하면 정보를 추출하는 파이썬 라이브러리입니다.
Google의 LangExtract를 활용하여 구조화된 정보 추출을 제공합니다.
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

# 편의 함수
def extract_from_url(url: str, **kwargs) -> ResumeInfo:
    """
    URL에서 이력서 정보를 추출하는 편의 함수.
    
    Args:
        url: 이력서 파일 URL
        **kwargs: ResumeExtractor 생성자에 전달될 키워드 인자
        
    Returns:
        ResumeInfo: 추출된 이력서 정보
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_url(url)


def extract_from_file(file_path: str, **kwargs) -> ResumeInfo:
    """
    로컬 파일에서 이력서 정보를 추출하는 편의 함수.
    
    Args:
        file_path: 로컬 이력서 파일 경로
        **kwargs: ResumeExtractor 생성자에 전달될 키워드 인자
        
    Returns:
        ResumeInfo: 추출된 이력서 정보
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_file(file_path)


__all__ = [
    "__version__",
    # 메인 클래스
    "ResumeExtractor",
    # 모델
    "ResumeInfo",
    "ContactInfo",
    "ExperienceInfo",
    "EducationInfo",
    "ProjectInfo",
    "CertificationInfo",
    # 예외
    "ResumeExtractError",
    "InvalidURLError",
    "UnsupportedFileTypeError",
    "DownloadError",
    "ParseError",
    "ExtractionError",
    "LangExtractAPIError",
    # 편의 함수
    "extract_from_url",
    "extract_from_file",
]

