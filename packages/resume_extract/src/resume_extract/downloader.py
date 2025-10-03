import os
import tempfile
from pathlib import Path
from typing import Tuple, Optional
import logging
import requests
import validators
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from .exceptions import DownloadError, InvalidURLError, UnsupportedFileTypeError
from .parsers import WebPageParser

logger = logging.getLogger(__name__)


class URLDownloader:
    """URL에서 파일을 다운로드하고 처리하는 클래스"""
    
    def __init__(self, 
                 max_file_size_mb: int = 10,
                 timeout: int = 30,
                 max_retries: int = 3):
        self.max_file_size_bytes = max_file_size_mb * 1024 * 1024
        self.timeout = timeout
        self.max_retries = max_retries
        self.web_parser = WebPageParser()
        
        # 지원하는 파일 형식
        self.supported_content_types = {
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/html',
            'text/htm'
        }
        
        # requests 세션 설정
        self.session = requests.Session()
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
    
    def download_and_extract_text(self, url: str) -> Tuple[str, Optional[str]]:
        """
        URL에서 파일을 다운로드하고 텍스트를 추출합니다.
        
        Returns:
            Tuple[str, Optional[str]]: (추출된 텍스트, 임시 파일 경로)
        """
        # URL 유효성 검사
        if not validators.url(url):
            raise InvalidURLError(url)
        
        try:
            # HEAD 요청으로 파일 정보 확인
            head_response = self.session.head(url, timeout=self.timeout, allow_redirects=True)
            content_type = head_response.headers.get('content-type', '').split(';')[0].strip()
            content_length = head_response.headers.get('content-length')
            
            # 파일 크기 체크
            if content_length:
                if int(content_length) > self.max_file_size_bytes:
                    raise DownloadError(url, f"파일 크기가 {self.max_file_size_bytes // (1024*1024)}MB를 초과합니다")
            
            # HTML 페이지인 경우 직접 텍스트 추출
            if content_type in ['text/html', 'text/htm'] or not content_type:
                return self._extract_from_webpage(url), None
            
            # 지원하는 파일 형식인지 확인
            if content_type not in self.supported_content_types:
                # 일부 서버에서 content-type을 제대로 반환하지 않는 경우를 위해 파일 확장자로도 체크
                if not self._is_supported_by_extension(url):
                    raise UnsupportedFileTypeError(content_type)
            
            # 파일 다운로드
            temp_file_path = self._download_file(url, content_type)
            
            return temp_file_path, temp_file_path
            
        except requests.exceptions.RequestException as e:
            raise DownloadError(url, f"네트워크 오류: {str(e)}")
        except Exception as e:
            if isinstance(e, (DownloadError, InvalidURLError, UnsupportedFileTypeError)):
                raise
            raise DownloadError(url, f"다운로드 중 오류: {str(e)}")
    
    def _extract_from_webpage(self, url: str) -> str:
        """웹페이지에서 직접 텍스트 추출"""
        try:
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            # 인코딩 설정
            if response.encoding is None or response.encoding == 'ISO-8859-1':
                response.encoding = 'utf-8'
            
            return self.web_parser.parse_html_content(response.text)
            
        except requests.exceptions.RequestException as e:
            raise DownloadError(url, f"웹페이지 로드 오류: {str(e)}")
    
    def _download_file(self, url: str, content_type: str) -> str:
        """파일을 임시 디렉토리에 다운로드"""
        try:
            response = self.session.get(url, timeout=self.timeout, stream=True)
            response.raise_for_status()
            
            # 임시 파일 생성
            suffix = self._get_file_suffix(content_type, url)
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
            temp_file_path = temp_file.name
            
            # 스트리밍으로 파일 다운로드 (메모리 효율성)
            downloaded_size = 0
            with open(temp_file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        downloaded_size += len(chunk)
                        if downloaded_size > self.max_file_size_bytes:
                            os.unlink(temp_file_path)
                            raise DownloadError(url, f"파일 크기가 {self.max_file_size_bytes // (1024*1024)}MB를 초과합니다")
                        f.write(chunk)
            
            return temp_file_path
            
        except requests.exceptions.RequestException as e:
            raise DownloadError(url, f"파일 다운로드 오류: {str(e)}")
    
    def _get_file_suffix(self, content_type: str, url: str) -> str:
        """Content-Type이나 URL에서 파일 확장자 추출"""
        suffix_map = {
            'application/pdf': '.pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/msword': '.doc',
            'text/plain': '.txt',
            'text/html': '.html'
        }
        
        suffix = suffix_map.get(content_type)
        if suffix:
            return suffix
        
        # URL에서 확장자 추출 시도
        path = Path(url).suffix.lower()
        if path in ['.pdf', '.docx', '.doc', '.txt', '.html', '.htm']:
            return path
        
        return '.txt'  # 기본값
    
    def _is_supported_by_extension(self, url: str) -> bool:
        """URL의 확장자로 지원 여부 확인"""
        supported_extensions = {'.pdf', '.docx', '.doc', '.txt', '.html', '.htm'}
        path = Path(url)
        return path.suffix.lower() in supported_extensions
    
    def cleanup_temp_file(self, file_path: Optional[str]) -> None:
        """임시 파일 정리"""
        if file_path and os.path.exists(file_path):
            try:
                os.unlink(file_path)
                logger.info(f"임시 파일 삭제됨: {file_path}")
            except OSError as e:
                logger.warning(f"임시 파일 삭제 실패: {file_path}, 오류: {e}")
    
    def close(self) -> None:
        """리소스 정리"""
        if self.session:
            self.session.close()
