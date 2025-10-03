"""
파일 파서 테스트
"""

import os
import tempfile
import pytest
from pathlib import Path

from resume_extract.parsers import FileParser, WebPageParser
from resume_extract.exceptions import ParseError, UnsupportedFileTypeError


class TestFileParser:
    """FileParser 테스트"""
    
    def setup_method(self):
        """테스트 설정"""
        self.parser = FileParser()
    
    def test_txt_parsing(self):
        """텍스트 파일 파싱 테스트"""
        content = "이것은 테스트 텍스트입니다.\n두 번째 줄입니다."
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as f:
            f.write(content)
            temp_file = f.name
        
        try:
            result = self.parser.parse(temp_file)
            assert content in result
            assert "테스트 텍스트" in result
        finally:
            os.unlink(temp_file)
    
    def test_html_parsing(self):
        """HTML 파일 파싱 테스트"""
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>테스트 이력서</title>
            <style>body { font-family: Arial; }</style>
            <script>console.log('test');</script>
        </head>
        <body>
            <h1>홍길동</h1>
            <p>소프트웨어 엔지니어</p>
            <ul>
                <li>Python</li>
                <li>JavaScript</li>
            </ul>
        </body>
        </html>
        """
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
            f.write(html_content)
            temp_file = f.name
        
        try:
            result = self.parser.parse(temp_file)
            assert "홍길동" in result
            assert "소프트웨어 엔지니어" in result
            assert "Python" in result
            assert "JavaScript" in result
            # 스크립트와 스타일은 제거되어야 함
            assert "console.log" not in result
            assert "font-family" not in result
        finally:
            os.unlink(temp_file)
    
    def test_unsupported_file_type(self):
        """지원하지 않는 파일 형식 테스트"""
        with tempfile.NamedTemporaryFile(suffix='.xyz', delete=False) as f:
            temp_file = f.name
        
        try:
            with pytest.raises(UnsupportedFileTypeError):
                self.parser.parse(temp_file)
        finally:
            os.unlink(temp_file)
    
    def test_non_existent_file(self):
        """존재하지 않는 파일 테스트"""
        with pytest.raises(ParseError):
            self.parser.parse("/non/existent/file.txt")
    
    def test_empty_file(self):
        """빈 파일 테스트"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            temp_file = f.name
        
        try:
            with pytest.raises(ParseError):
                self.parser.parse(temp_file)
        finally:
            os.unlink(temp_file)


class TestWebPageParser:
    """WebPageParser 테스트"""
    
    def setup_method(self):
        """테스트 설정"""
        self.parser = WebPageParser()
    
    def test_html_content_parsing(self):
        """HTML 컨텐츠 파싱 테스트"""
        html_content = """
        <html>
        <head>
            <title>이력서</title>
            <script>alert('test');</script>
            <style>.header { color: blue; }</style>
        </head>
        <body>
            <nav>네비게이션</nav>
            <header>헤더</header>
            <main>
                <h1>김철수</h1>
                <p>이메일: kim@example.com</p>
                <div>
                    <h2>경력</h2>
                    <p>ABC 회사 - 개발자</p>
                </div>
            </main>
            <footer>푸터</footer>
        </body>
        </html>
        """
        
        result = self.parser.parse_html_content(html_content)
        
        # 메인 컨텐츠가 포함되어야 함
        assert "김철수" in result
        assert "kim@example.com" in result
        assert "ABC 회사" in result
        
        # 불필요한 요소들은 제거되어야 함
        assert "네비게이션" not in result
        assert "헤더" not in result
        assert "푸터" not in result
        assert "alert" not in result
        assert "color: blue" not in result
    
    def test_parse_error_handling(self):
        """파싱 오류 처리 테스트"""
        invalid_html = "<<<>>>"
        
        # 잘못된 HTML이어도 BeautifulSoup이 파싱 시도
        result = self.parser.parse_html_content(invalid_html)
        assert isinstance(result, str)
    
    def test_empty_content(self):
        """빈 컨텐츠 테스트"""
        empty_html = "<html><body></body></html>"
        
        result = self.parser.parse_html_content(empty_html)
        assert result == ""
