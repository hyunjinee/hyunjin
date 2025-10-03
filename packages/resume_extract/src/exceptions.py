"""
Exception classes for resume_extract
"""

from typing import Optional

class ResumeExtractError(Exception):
    """Resume Extract 기본 예외 클래스"""
    def __init__(self, message: str, details: Optional[str] = None):
        self.message = message
        self.details = details
        super().__init__(self.message)


class UnsupportedFileTypeError(ResumeExtractError):
    """지원하지 않는 파일 형식 예외"""
    def __init__(self, file_type: str):
        message = f"지원하지 않는 파일 형식입니다: {file_type}"
        super().__init__(message)
        self.file_type = file_type


class DownloadError(ResumeExtractError):
    """파일 다운로드 관련 예외"""
    def __init__(self, url: str, details: Optional[str] = None):
        message = f"파일 다운로드 실패: {url}"
        super().__init__(message, details)
        self.url = url


class ParseError(ResumeExtractError):
    """파일 파싱 관련 예외"""
    def __init__(self, file_path: str, details: Optional[str] = None):
        message = f"파일 파싱 실패: {file_path}"
        super().__init__(message, details)
        self.file_path = file_path


class ExtractionError(ResumeExtractError):
    """정보 추출 관련 예외"""
    def __init__(self, details: Optional[str] = None):
        message = "정보 추출에 실패했습니다"
        super().__init__(message, details)


class InvalidURLError(ResumeExtractError):
    """잘못된 URL 예외"""
    def __init__(self, url: str):
        message = f"잘못된 URL입니다: {url}"
        super().__init__(message)
        self.url = url


class LangExtractAPIError(ResumeExtractError):
    """LangExtract API 관련 예외"""
    def __init__(self, details: Optional[str] = None):
        message = "LangExtract API 호출 중 오류가 발생했습니다"
        super().__init__(message, details)
