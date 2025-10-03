"""
메인 추출기 테스트
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from resume_extract.extractor import ResumeExtractor
from resume_extract.models import ResumeInfo, ContactInfo
from resume_extract.exceptions import InvalidURLError, ExtractionError
from resume_extract import extract_from_url


class TestResumeExtractor:
    """ResumeExtractor 테스트"""
    
    def setup_method(self):
        """테스트 설정"""
        # LangExtract 모킹 (실제 API 호출 없이 테스트)
        self.mock_langextract = Mock()
        self.extractor = None
    
    def teardown_method(self):
        """테스트 정리"""
        if self.extractor:
            self.extractor.close()
    
    def test_extractor_initialization(self):
        """추출기 초기화 테스트"""
        extractor = ResumeExtractor(
            langextract_api_key="test-key",
            model_id="test-model",
            max_file_size_mb=5
        )
        
        assert extractor.langextract_api_key == "test-key"
        assert extractor.model_id == "test-model"
        assert extractor.max_file_size_mb == 5
        
        extractor.close()
    
    def test_get_supported_file_types(self):
        """지원 파일 형식 확인 테스트"""
        extractor = ResumeExtractor(langextract_api_key="test-key")
        
        supported_types = extractor.get_supported_file_types()
        
        assert isinstance(supported_types, list)
        assert len(supported_types) > 0
        assert any('PDF' in file_type for file_type in supported_types)
        assert any('Word' in file_type for file_type in supported_types)
        
        extractor.close()
    
    @patch('resume_extract.extractor.LangExtractProcessor')
    def test_extract_from_text(self, mock_langextract_processor):
        """텍스트 추출 테스트"""
        # Mock LangExtract 프로세서
        mock_processor = Mock()
        mock_processor.extract_resume_info.return_value = ResumeInfo(
            name="테스트 사용자",
            contact=ContactInfo(email="test@example.com")
        )
        mock_langextract_processor.return_value = mock_processor
        
        extractor = ResumeExtractor(langextract_api_key="test-key")
        
        sample_text = """
        테스트 사용자
        이메일: test@example.com
        전화: 010-1234-5678
        """
        
        result = extractor.extract_from_text(sample_text)
        
        assert isinstance(result, ResumeInfo)
        assert result.name == "테스트 사용자"
        assert result.contact.email == "test@example.com"
        
        # LangExtract 프로세서가 호출되었는지 확인
        mock_processor.extract_resume_info.assert_called_once_with(sample_text)
        
        extractor.close()
    
    def test_extract_from_empty_text(self):
        """빈 텍스트 추출 테스트"""
        extractor = ResumeExtractor(langextract_api_key="test-key")
        
        with pytest.raises(ExtractionError):
            extractor.extract_from_text("")
        
        with pytest.raises(ExtractionError):
            extractor.extract_from_text("   ")
        
        extractor.close()
    
    @patch('resume_extract.extractor.URLDownloader')
    @patch('resume_extract.extractor.LangExtractProcessor')
    def test_extract_from_url_invalid_url(self, mock_langextract, mock_downloader):
        """잘못된 URL 테스트"""
        mock_downloader_instance = Mock()
        mock_downloader_instance.download_and_extract_text.side_effect = InvalidURLError("invalid-url")
        mock_downloader.return_value = mock_downloader_instance
        
        extractor = ResumeExtractor(langextract_api_key="test-key")
        
        with pytest.raises(InvalidURLError):
            extractor.extract_from_url("not-a-url")
        
        extractor.close()
    
    def test_context_manager(self):
        """컨텍스트 매니저 테스트"""
        with ResumeExtractor(langextract_api_key="test-key") as extractor:
            assert extractor is not None
            assert isinstance(extractor, ResumeExtractor)
        
        # 컨텍스트 매니저가 종료되면 close()가 호출되어야 함


class TestConvenienceFunctions:
    """편의 함수 테스트"""
    
    @patch('resume_extract.ResumeExtractor')
    def test_extract_from_url_function(self, mock_extractor_class):
        """extract_from_url 편의 함수 테스트"""
        # Mock ResumeExtractor with context manager support
        mock_extractor = MagicMock()
        mock_extractor.extract_from_url.return_value = ResumeInfo(name="테스트")
        mock_extractor.__enter__.return_value = mock_extractor
        mock_extractor.__exit__.return_value = None
        mock_extractor_class.return_value = mock_extractor
        
        # 편의 함수 호출
        result = extract_from_url("http://test.com/resume.pdf", langextract_api_key="test-key")
        
        # ResumeExtractor가 올바르게 생성되고 호출되었는지 확인
        mock_extractor_class.assert_called_once_with(langextract_api_key="test-key")
        mock_extractor.extract_from_url.assert_called_once_with("http://test.com/resume.pdf")
        mock_extractor.__enter__.assert_called_once()
        mock_extractor.__exit__.assert_called_once()
        
        assert isinstance(result, ResumeInfo)
        assert result.name == "테스트"
