"""
다양한 파일 형식을 텍스트로 변환하는 파서들
"""

import os
from typing import Optional
from pathlib import Path
import logging
import pypdf
import docx
from bs4 import BeautifulSoup
from .exceptions import ParseError, UnsupportedFileTypeError

logger = logging.getLogger(__name__)


class FileParser:
    """파일을 텍스트로 변환하는 파서"""
    def __init__(self):
        self.supported_extensions = {
            '.pdf': self._parse_pdf,
            '.docx': self._parse_docx,
            '.doc': self._parse_doc,
            '.txt': self._parse_txt,
            '.html': self._parse_html,
            '.htm': self._parse_html,
        }
    
    def parse(self, file_path: str, content_type: Optional[str] = None) -> str:
        """파일을 텍스트로 변환"""
        try:
            file_path = Path(file_path)
            
            if not file_path.exists():
                raise ParseError(str(file_path), "파일이 존재하지 않습니다")
            
            extension = file_path.suffix.lower()
            
            # content_type을 기반으로 확장자 결정
            if content_type:
                extension = self._get_extension_from_content_type(content_type)
            
            if extension not in self.supported_extensions:
                raise UnsupportedFileTypeError(extension)
            
            parser_func = self.supported_extensions[extension]
            text = parser_func(str(file_path))
            
            if not text.strip():
                raise ParseError(str(file_path), "파일에서 텍스트를 추출할 수 없습니다")
            
            return text.strip()
            
        except Exception as e:
            if isinstance(e, (ParseError, UnsupportedFileTypeError)):
                raise
            logger.error(f"파일 파싱 중 오류: {str(e)}")
            raise ParseError(str(file_path), str(e))
    
    def _get_extension_from_content_type(self, content_type: str) -> str:
        """Content-Type을 기반으로 확장자 반환"""
        type_map = {
            'application/pdf': '.pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/msword': '.doc',
            'text/html': '.html',
            'text/plain': '.txt',
        }
        return type_map.get(content_type, '')
    
    def _parse_pdf(self, file_path: str) -> str:
        """PDF 파일 파싱"""
        if pypdf is None:
            raise ImportError("pypdf가 설치되지 않았습니다. pip install pypdf")
        
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = pypdf.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise ParseError(file_path, f"PDF 파싱 오류: {str(e)}")
    
    def _parse_docx(self, file_path: str) -> str:
        """DOCX 파일 파싱"""
        if docx is None:
            raise ImportError("python-docx가 설치되지 않았습니다. pip install python-docx")
        
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise ParseError(file_path, f"DOCX 파싱 오류: {str(e)}")
    
    def _parse_doc(self, file_path: str) -> str:
        """DOC 파일 파싱 (제한적 지원)"""
        # DOC 파일은 복잡한 형식이므로 완전한 지원이 어려움
        # 기본적으로 텍스트 파일로 읽기 시도
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                return file.read()
        except Exception as e:
            raise ParseError(file_path, f"DOC 파싱 오류 (제한적 지원): {str(e)}")
    
    def _parse_txt(self, file_path: str) -> str:
        """텍스트 파일 파싱"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # UTF-8이 안 되면 다른 인코딩 시도
            for encoding in ['cp949', 'euc-kr', 'iso-8859-1']:
                try:
                    with open(file_path, 'r', encoding=encoding) as file:
                        return file.read()
                except UnicodeDecodeError:
                    continue
            raise ParseError(file_path, "텍스트 파일 인코딩을 확인할 수 없습니다")
        except Exception as e:
            raise ParseError(file_path, f"텍스트 파일 파싱 오류: {str(e)}")
    
    def _parse_html(self, file_path: str) -> str:
        """HTML 파일 파싱"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 스크립트와 스타일 태그 제거
            for script in soup(['script', 'style']):
                script.decompose()
            
            return soup.get_text(separator='\n', strip=True)
        except Exception as e:
            raise ParseError(file_path, f"HTML 파싱 오류: {str(e)}")


class WebPageParser:
    """웹페이지를 텍스트로 변환하는 파서"""
    
    def parse_html_content(self, html_content: str) -> str:
        """HTML 컨텐츠를 텍스트로 변환"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 불필요한 태그들 제거
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
                tag.decompose()
            
            # 텍스트 추출
            text = soup.get_text(separator='\n', strip=True)
            
            # 빈 줄들 정리
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            return '\n'.join(lines)
            
        except Exception as e:
            raise ParseError("HTML content", f"HTML 컨텐츠 파싱 오류: {str(e)}")
