"""
메인 이력서 정보 추출기
"""

import os
import logging
from typing import Optional, Union
from pathlib import Path

from .models import ResumeInfo
from .downloader import URLDownloader
from .parsers import FileParser
from .langextract_integration import LangExtractProcessor
from .exceptions import (
    ResumeExtractError, 
    InvalidURLError, 
    UnsupportedFileTypeError,
    DownloadError,
    ParseError,
    ExtractionError
)

logger = logging.getLogger(__name__)


class ResumeExtractor:
    """
    이력서 정보 추출을 위한 메인 클래스
    
    Usage:
        extractor = ResumeExtractor()
        result = extractor.extract_from_url("https://example.com/resume.pdf")
        print(result.name)
        print(result.contact.email)
    """
    
    def __init__(self, 
                 langextract_api_key: Optional[str] = None,
                 model_id: str = "gemini-2.0-flash",
                 max_file_size_mb: int = 10,
                 timeout: int = 30,
                 max_retries: int = 3):
        """
        ResumeExtractor 초기화
        
        Args:
            langextract_api_key: LangExtract API 키 (환경변수에서 자동 로드)
            model_id: LangExtract에서 사용할 모델 ID
            max_file_size_mb: 최대 파일 크기 (MB)
            timeout: 네트워크 타임아웃 (초)
            max_retries: 최대 재시도 횟수
        """
        self.langextract_api_key = langextract_api_key
        self.model_id = model_id
        self.max_file_size_mb = max_file_size_mb
        self.timeout = timeout
        self.max_retries = max_retries
        
        # 컴포넌트 초기화
        self.downloader = URLDownloader(
            max_file_size_mb=max_file_size_mb,
            timeout=timeout,
            max_retries=max_retries
        )
        self.parser = FileParser()
        self.langextract_processor = None
        
        # 로깅 설정
        self._setup_logging()
    
    def _setup_logging(self):
        """로깅 설정"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    def _get_langextract_processor(self) -> LangExtractProcessor:
        """LangExtract 프로세서 lazily 초기화"""
        if self.langextract_processor is None:
            self.langextract_processor = LangExtractProcessor(
                api_key=self.langextract_api_key,
                model_id=self.model_id
            )
        return self.langextract_processor
    
    def extract_from_url(self, url: str) -> ResumeInfo:
        """
        URL에서 이력서 정보를 추출합니다.
        
        Args:
            url: 이력서 파일이나 웹페이지 URL
            
        Returns:
            ResumeInfo: 추출된 이력서 정보
            
        Raises:
            InvalidURLError: 잘못된 URL
            UnsupportedFileTypeError: 지원하지 않는 파일 형식
            DownloadError: 다운로드 실패
            ParseError: 파싱 실패
            ExtractionError: 정보 추출 실패
        """
        temp_file_path = None
        
        try:
            logger.info(f"이력서 추출 시작: {url}")
            
            # 1. URL에서 파일 다운로드 또는 웹페이지 텍스트 추출
            text_content, temp_file_path = self.downloader.download_and_extract_text(url)
            
            # 2. 파일인 경우 텍스트로 파싱
            if temp_file_path:
                text_content = self.parser.parse(temp_file_path)
                logger.info(f"파일 파싱 완료. 텍스트 길이: {len(text_content)} 문자")
            else:
                logger.info(f"웹페이지 텍스트 추출 완료. 텍스트 길이: {len(text_content)} 문자")
            
            # 3. LangExtract를 사용하여 구조화된 정보 추출
            langextract_processor = self._get_langextract_processor()
            resume_info = langextract_processor.extract_resume_info(text_content)
            
            logger.info(f"이력서 정보 추출 완료: {resume_info.name or '이름 없음'}")
            
            return resume_info
            
        except Exception as e:
            logger.error(f"이력서 추출 중 오류: {str(e)}")
            raise
        
        finally:
            # 임시 파일 정리
            if temp_file_path:
                self.downloader.cleanup_temp_file(temp_file_path)
    
    def extract_from_file(self, file_path: Union[str, Path]) -> ResumeInfo:
        """
        로컬 파일에서 이력서 정보를 추출합니다.
        
        Args:
            file_path: 이력서 파일 경로
            
        Returns:
            ResumeInfo: 추출된 이력서 정보
            
        Raises:
            UnsupportedFileTypeError: 지원하지 않는 파일 형식
            ParseError: 파싱 실패
            ExtractionError: 정보 추출 실패
        """
        try:
            file_path = Path(file_path)
            logger.info(f"로컬 파일 추출 시작: {file_path}")
            
            if not file_path.exists():
                raise ParseError(str(file_path), "파일이 존재하지 않습니다")
            
            # 1. 파일을 텍스트로 파싱
            text_content = self.parser.parse(str(file_path))
            logger.info(f"파일 파싱 완료. 텍스트 길이: {len(text_content)} 문자")
            
            # 2. LangExtract를 사용하여 구조화된 정보 추출
            langextract_processor = self._get_langextract_processor()
            resume_info = langextract_processor.extract_resume_info(text_content)
            
            logger.info(f"이력서 정보 추출 완료: {resume_info.name or '이름 없음'}")
            
            return resume_info
            
        except Exception as e:
            logger.error(f"로컬 파일 추출 중 오류: {str(e)}")
            raise
    
    def extract_from_text(self, text: str) -> ResumeInfo:
        """
        텍스트에서 직접 이력서 정보를 추출합니다.
        
        Args:
            text: 이력서 텍스트 내용
            
        Returns:
            ResumeInfo: 추출된 이력서 정보
            
        Raises:
            ExtractionError: 정보 추출 실패
        """
        try:
            logger.info(f"텍스트에서 직접 추출 시작. 텍스트 길이: {len(text)} 문자")
            
            if not text.strip():
                raise ExtractionError("빈 텍스트입니다")
            
            # LangExtract를 사용하여 구조화된 정보 추출
            langextract_processor = self._get_langextract_processor()
            resume_info = langextract_processor.extract_resume_info(text)
            
            logger.info(f"이력서 정보 추출 완료: {resume_info.name or '이름 없음'}")
            
            return resume_info
            
        except Exception as e:
            logger.error(f"텍스트 추출 중 오류: {str(e)}")
            raise
    
    def get_supported_file_types(self) -> list:
        """지원하는 파일 형식 리스트 반환"""
        return [
            'PDF (.pdf)',
            'Word Document (.docx)',
            'Word Document (.doc)',
            'Text File (.txt)',
            'HTML (.html, .htm)',
            'Web Pages (HTTP/HTTPS URLs)'
        ]
    
    def close(self):
        """리소스 정리"""
        if self.downloader:
            self.downloader.close()
        logger.info("ResumeExtractor 리소스 정리 완료")
    
    def __enter__(self):
        """컨텍스트 매니저 진입"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """컨텍스트 매니저 종료"""
        self.close()


# 편의 함수들
def extract_from_url(url: str, **kwargs) -> ResumeInfo:
    """
    URL에서 이력서 정보를 추출하는 편의 함수
    
    Args:
        url: 이력서 URL
        **kwargs: ResumeExtractor 생성자 인자들
        
    Returns:
        ResumeInfo: 추출된 이력서 정보
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_url(url)


def extract_from_file(file_path: Union[str, Path], **kwargs) -> ResumeInfo:
    """
    파일에서 이력서 정보를 추출하는 편의 함수
    
    Args:
        file_path: 이력서 파일 경로
        **kwargs: ResumeExtractor 생성자 인자들
        
    Returns:
        ResumeInfo: 추출된 이력서 정보
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_file(file_path)


def extract_from_text(text: str, **kwargs) -> ResumeInfo:
    """
    텍스트에서 이력서 정보를 추출하는 편의 함수
    
    Args:
        text: 이력서 텍스트
        **kwargs: ResumeExtractor 생성자 인자들
        
    Returns:
        ResumeInfo: 추출된 이력서 정보
    """
    with ResumeExtractor(**kwargs) as extractor:
        return extractor.extract_from_text(text)
