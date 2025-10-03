"""
데이터 모델 테스트
"""

import pytest
from resume_extract.models import (
    ContactInfo, ExperienceInfo, EducationInfo, 
    ProjectInfo, CertificationInfo, ResumeInfo
)


class TestContactInfo:
    """ContactInfo 모델 테스트"""
    
    def test_contact_info_creation(self):
        """기본 생성 테스트"""
        contact = ContactInfo(
            email="test@example.com",
            phone="010-1234-5678",
            address="Seoul, Korea"
        )
        
        assert contact.email == "test@example.com"
        assert contact.phone == "010-1234-5678"
        assert contact.address == "Seoul, Korea"
        assert contact.linkedin is None
    
    def test_contact_info_optional_fields(self):
        """선택적 필드 테스트"""
        contact = ContactInfo()
        
        assert contact.email is None
        assert contact.phone is None
        assert contact.address is None
        assert contact.linkedin is None
        assert contact.github is None
        assert contact.website is None


class TestResumeInfo:
    """ResumeInfo 모델 테스트"""
    
    def test_resume_info_creation(self):
        """기본 생성 테스트"""
        resume = ResumeInfo(
            name="홍길동",
            contact=ContactInfo(email="hong@example.com"),
            skills=["Python", "JavaScript"],
            confidence_score=0.9
        )
        
        assert resume.name == "홍길동"
        assert resume.contact.email == "hong@example.com"
        assert resume.skills == ["Python", "JavaScript"]
        assert resume.confidence_score == 0.9
    
    def test_confidence_score_validation(self):
        """신뢰도 점수 유효성 검사"""
        # 유효한 범위
        resume = ResumeInfo(confidence_score=0.5)
        assert resume.confidence_score == 0.5
        
        # 잘못된 범위
        with pytest.raises(ValueError):
            ResumeInfo(confidence_score=1.5)
        
        with pytest.raises(ValueError):
            ResumeInfo(confidence_score=-0.1)
    
    def test_to_dict_method(self):
        """딕셔너리 변환 테스트"""
        resume = ResumeInfo(
            name="테스트",
            skills=["Python"]
        )
        
        result = resume.to_dict()
        assert isinstance(result, dict)
        assert result['name'] == "테스트"
        assert result['skills'] == ["Python"]
    
    def test_to_json_method(self):
        """JSON 변환 테스트"""
        resume = ResumeInfo(
            name="테스트",
            skills=["Python"]
        )
        
        result = resume.to_json()
        assert isinstance(result, str)
        assert "테스트" in result
        assert "Python" in result


class TestExperienceInfo:
    """ExperienceInfo 모델 테스트"""
    
    def test_experience_info_creation(self):
        """경력 정보 생성 테스트"""
        exp = ExperienceInfo(
            company="테스트 회사",
            position="소프트웨어 엔지니어",
            duration="2020.01 - 2023.12",
            technologies=["Python", "Django"]
        )
        
        assert exp.company == "테스트 회사"
        assert exp.position == "소프트웨어 엔지니어"
        assert exp.duration == "2020.01 - 2023.12"
        assert exp.technologies == ["Python", "Django"]
        assert exp.description is None


class TestEducationInfo:
    """EducationInfo 모델 테스트"""
    
    def test_education_info_creation(self):
        """학력 정보 생성 테스트"""
        edu = EducationInfo(
            institution="서울대학교",
            degree="학사",
            major="컴퓨터공학과",
            duration="2016.03 - 2020.02"
        )
        
        assert edu.institution == "서울대학교"
        assert edu.degree == "학사"
        assert edu.major == "컴퓨터공학과"
        assert edu.duration == "2016.03 - 2020.02"
        assert edu.gpa is None


class TestProjectInfo:
    """ProjectInfo 모델 테스트"""
    
    def test_project_info_creation(self):
        """프로젝트 정보 생성 테스트"""
        project = ProjectInfo(
            name="테스트 프로젝트",
            description="프로젝트 설명",
            technologies=["React", "Node.js"]
        )
        
        assert project.name == "테스트 프로젝트"
        assert project.description == "프로젝트 설명"
        assert project.technologies == ["React", "Node.js"]
        assert project.url is None


class TestCertificationInfo:
    """CertificationInfo 모델 테스트"""
    
    def test_certification_info_creation(self):
        """자격증 정보 생성 테스트"""
        cert = CertificationInfo(
            name="AWS Solutions Architect",
            issuer="Amazon Web Services",
            date="2023.01"
        )
        
        assert cert.name == "AWS Solutions Architect"
        assert cert.issuer == "Amazon Web Services"
        assert cert.date == "2023.01"
        assert cert.expiration_date is None
