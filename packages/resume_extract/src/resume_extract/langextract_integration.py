"""
LangExtract를 이용한 정보 추출 모듈
"""

import os
import logging
from typing import List, Dict, Any, Optional
import langextract as lx
from .models import (
    ResumeInfo, ContactInfo, ExperienceInfo, EducationInfo, 
    ProjectInfo, CertificationInfo
)
from .exceptions import LangExtractAPIError, ExtractionError

logger = logging.getLogger(__name__)


class LangExtractProcessor:
    """LangExtract를 사용한 이력서 정보 추출 프로세서"""
    
    def __init__(self, api_key: Optional[str] = None, model_id: str = "gemini-2.0-flash"):
        if lx is None:
            raise ImportError("langextract가 설치되지 않았습니다. pip install langextract")
        
        self.api_key = api_key or os.getenv('LANGEXTRACT_API_KEY')
        if not self.api_key:
            raise ValueError("LANGEXTRACT_API_KEY 환경 변수가 설정되어야 합니다")
        
        self.model_id = model_id
        
        # LangExtract 설정 (API 키가 필요한 경우 설정)
        os.environ['LANGEXTRACT_API_KEY'] = self.api_key
    
    def extract_resume_info(self, text: str) -> ResumeInfo:
        """텍스트에서 이력서 정보 추출"""
        try:
            # 추출 작업 정의
            prompt = self._get_extraction_prompt()
            examples = self._get_extraction_examples()
            
            # LangExtract를 사용한 정보 추출
            result = lx.extract(
                text_or_documents=text,
                prompt_description=prompt,
                examples=examples,
                model_id=self.model_id
            )
            
            # 결과를 ResumeInfo 모델로 변환
            resume_info = self._convert_to_resume_info(result, text)
            
            return resume_info
            
        except Exception as e:
            logger.error(f"LangExtract 추출 중 오류: {str(e)}")
            if "api" in str(e).lower() or "key" in str(e).lower():
                raise LangExtractAPIError(str(e))
            raise ExtractionError(str(e))
    
    def _get_extraction_prompt(self) -> str:
        """추출 작업을 위한 프롬프트 반환"""
        return """
        다음 이력서 텍스트에서 구조화된 정보를 추출해주세요:
        
        - 개인 정보 (이름, 연락처)
        - 연락처 (이메일, 전화번호, 주소, LinkedIn, GitHub, 웹사이트)
        - 요약/자기소개
        - 기술/스킬
        - 경력 사항 (회사명, 직책, 기간, 업무 설명, 사용 기술)
        - 학력 (기관명, 학위, 전공, 기간, 성적, 설명)
        - 프로젝트 경험 (프로젝트명, 설명, 사용 기술, 기간, URL, 역할)
        - 자격증 (자격증명, 발급기관, 취득일, 만료일, 자격증 ID, URL)
        - 언어 능력
        
        정확한 정보만 추출하고, 없는 정보는 추측하지 마세요.
        """
    
    def _get_extraction_examples(self) -> List[lx.data.ExampleData]:
        """추출 예제 데이터 반환"""
        examples = [
            lx.data.ExampleData(
                text="""
                김철수
                이메일: chulsoo.kim@example.com
                전화: 010-1234-5678
                주소: 서울특별시 강남구
                LinkedIn: linkedin.com/in/chulsookim
                GitHub: github.com/chulsookim
                
                ## 경력
                ### ABC 회사 - 시니어 소프트웨어 엔지니어 (2020.01 ~ 2023.12)
                - React, Node.js를 이용한 웹 애플리케이션 개발
                - 마이크로서비스 아키텍처 설계 및 구현
                
                ## 학력
                서울대학교 컴퓨터공학과 학사 (2014.03 ~ 2018.02)
                학점: 3.8/4.0
                
                ## 기술
                JavaScript, React, Node.js, Python, AWS
                
                ## 프로젝트
                ### E-commerce 플랫폼 (2022.01 ~ 2022.06)
                온라인 쇼핑몰 개발 프로젝트
                기술: React, Node.js, MongoDB
                역할: 프론트엔드 개발 담당
                
                ## 자격증
                AWS Solutions Architect - Associate
                발급기관: Amazon Web Services
                취득일: 2021.03
                """,
                extractions=[
                    lx.data.Extraction(extraction_class="이름", extraction_text="김철수"),
                    lx.data.Extraction(extraction_class="이메일", extraction_text="chulsoo.kim@example.com"),
                    lx.data.Extraction(extraction_class="전화번호", extraction_text="010-1234-5678"),
                    lx.data.Extraction(extraction_class="주소", extraction_text="서울특별시 강남구"),
                    lx.data.Extraction(extraction_class="LinkedIn", extraction_text="linkedin.com/in/chulsookim"),
                    lx.data.Extraction(extraction_class="GitHub", extraction_text="github.com/chulsookim"),
                    lx.data.Extraction(extraction_class="회사", extraction_text="ABC 회사"),
                    lx.data.Extraction(extraction_class="직책", extraction_text="시니어 소프트웨어 엔지니어"),
                    lx.data.Extraction(extraction_class="근무기간", extraction_text="2020.01 ~ 2023.12"),
                    lx.data.Extraction(extraction_class="업무설명", extraction_text="React, Node.js를 이용한 웹 애플리케이션 개발"),
                    lx.data.Extraction(extraction_class="학교", extraction_text="서울대학교"),
                    lx.data.Extraction(extraction_class="학위", extraction_text="학사"),
                    lx.data.Extraction(extraction_class="전공", extraction_text="컴퓨터공학과"),
                    lx.data.Extraction(extraction_class="학업기간", extraction_text="2014.03 ~ 2018.02"),
                    lx.data.Extraction(extraction_class="성적", extraction_text="3.8/4.0"),
                    lx.data.Extraction(extraction_class="기술", extraction_text="JavaScript, React, Node.js, Python, AWS"),
                    lx.data.Extraction(extraction_class="프로젝트명", extraction_text="E-commerce 플랫폼"),
                    lx.data.Extraction(extraction_class="프로젝트설명", extraction_text="온라인 쇼핑몰 개발 프로젝트"),
                    lx.data.Extraction(extraction_class="프로젝트기술", extraction_text="React, Node.js, MongoDB"),
                    lx.data.Extraction(extraction_class="프로젝트기간", extraction_text="2022.01 ~ 2022.06"),
                    lx.data.Extraction(extraction_class="자격증", extraction_text="AWS Solutions Architect - Associate"),
                    lx.data.Extraction(extraction_class="발급기관", extraction_text="Amazon Web Services"),
                    lx.data.Extraction(extraction_class="취득일", extraction_text="2021.03"),
                ]
            )
        ]
        
        return examples
    
    def _convert_to_resume_info(self, langextract_result: Any, original_text: str) -> ResumeInfo:
        """LangExtract 결과를 ResumeInfo 모델로 변환"""
        try:
            # LangExtract 결과에서 정보 추출
            extracted_data = self._parse_langextract_result(langextract_result)
            
            # ResumeInfo 객체 생성
            resume_info = ResumeInfo(
                name=extracted_data.get('name'),
                contact=ContactInfo(
                    email=extracted_data.get('email'),
                    phone=extracted_data.get('phone'),
                    address=extracted_data.get('address'),
                    linkedin=extracted_data.get('linkedin'),
                    github=extracted_data.get('github'),
                    website=extracted_data.get('website')
                ),
                summary=extracted_data.get('summary'),
                skills=extracted_data.get('skills', []),
                experience=self._build_experience_list(extracted_data.get('experience', [])),
                education=self._build_education_list(extracted_data.get('education', [])),
                projects=self._build_projects_list(extracted_data.get('projects', [])),
                certifications=self._build_certifications_list(extracted_data.get('certifications', [])),
                languages=extracted_data.get('languages', []),
                raw_text=original_text,
                confidence_score=extracted_data.get('confidence_score', 0.8)
            )
            
            return resume_info
            
        except Exception as e:
            logger.error(f"ResumeInfo 변환 중 오류: {str(e)}")
            raise ExtractionError(f"결과 변환 오류: {str(e)}")
    
    def _parse_langextract_result(self, result: Any) -> Dict[str, Any]:
        """LangExtract 결과를 파싱하여 딕셔너리로 변환"""
        # LangExtract 결과의 구조에 따라 적절히 파싱
        # 실제 구현은 LangExtract의 응답 형식에 맞춰 조정 필요
        parsed_data = {}
        
        if hasattr(result, 'extractions'):
            extractions = result.extractions
            for extraction in extractions:
                class_name = extraction.extraction_class.lower()
                text = extraction.extraction_text
                
                # 분류별로 정보 정리
                if '이름' in class_name or 'name' in class_name:
                    parsed_data['name'] = text
                elif '이메일' in class_name or 'email' in class_name:
                    parsed_data['email'] = text
                elif '전화' in class_name or 'phone' in class_name:
                    parsed_data['phone'] = text
                elif '주소' in class_name or 'address' in class_name:
                    parsed_data['address'] = text
                elif 'linkedin' in class_name:
                    parsed_data['linkedin'] = text
                elif 'github' in class_name:
                    parsed_data['github'] = text
                elif '기술' in class_name or 'skill' in class_name:
                    skills = [s.strip() for s in text.split(',')]
                    parsed_data['skills'] = skills
        
        return parsed_data
    
    def _build_experience_list(self, experience_data: List[Dict]) -> List[ExperienceInfo]:
        """경력 정보 리스트 생성"""
        experiences = []
        for exp in experience_data:
            experience = ExperienceInfo(
                company=exp.get('company', ''),
                position=exp.get('position', ''),
                duration=exp.get('duration', ''),
                description=exp.get('description'),
                technologies=exp.get('technologies', [])
            )
            experiences.append(experience)
        return experiences
    
    def _build_education_list(self, education_data: List[Dict]) -> List[EducationInfo]:
        """학력 정보 리스트 생성"""
        educations = []
        for edu in education_data:
            education = EducationInfo(
                institution=edu.get('institution', ''),
                degree=edu.get('degree', ''),
                major=edu.get('major'),
                duration=edu.get('duration', ''),
                gpa=edu.get('gpa'),
                description=edu.get('description')
            )
            educations.append(education)
        return educations
    
    def _build_projects_list(self, projects_data: List[Dict]) -> List[ProjectInfo]:
        """프로젝트 정보 리스트 생성"""
        projects = []
        for proj in projects_data:
            project = ProjectInfo(
                name=proj.get('name', ''),
                description=proj.get('description', ''),
                technologies=proj.get('technologies', []),
                duration=proj.get('duration'),
                url=proj.get('url'),
                role=proj.get('role')
            )
            projects.append(project)
        return projects
    
    def _build_certifications_list(self, certifications_data: List[Dict]) -> List[CertificationInfo]:
        """자격증 정보 리스트 생성"""
        certifications = []
        for cert in certifications_data:
            certification = CertificationInfo(
                name=cert.get('name', ''),
                issuer=cert.get('issuer', ''),
                date=cert.get('date'),
                expiration_date=cert.get('expiration_date'),
                credential_id=cert.get('credential_id'),
                url=cert.get('url')
            )
            certifications.append(certification)
        return certifications
