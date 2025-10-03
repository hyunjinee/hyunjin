"""
pytest 설정 및 공통 픽스처
"""

import os
import pytest
from unittest.mock import Mock


@pytest.fixture(autouse=True)
def mock_langextract_api_key(monkeypatch):
    """테스트용 LangExtract API 키 설정"""
    monkeypatch.setenv("LANGEXTRACT_API_KEY", "test-api-key")


@pytest.fixture
def sample_resume_text():
    """샘플 이력서 텍스트"""
    return """
    김철수
    이메일: chulsoo.kim@example.com
    전화: 010-1234-5678
    주소: 서울특별시 강남구
    LinkedIn: linkedin.com/in/chulsookim
    GitHub: github.com/chulsookim
    
    ## 요약
    5년 경력의 풀스택 개발자입니다.
    
    ## 경력
    ### ABC 회사 - 시니어 소프트웨어 엔지니어 (2020.01 ~ 2023.12)
    - React, Node.js를 이용한 웹 애플리케이션 개발
    - 마이크로서비스 아키텍처 설계 및 구현
    - 사용 기술: React, Node.js, AWS, Docker
    
    ### XYZ 스타트업 - 주니어 개발자 (2018.03 ~ 2019.12)
    - 모바일 앱 백엔드 API 개발
    - 사용 기술: Python, Django, PostgreSQL
    
    ## 학력
    서울대학교 컴퓨터공학과 학사 (2014.03 ~ 2018.02)
    학점: 3.8/4.0
    관련 과목: 데이터구조, 알고리즘, 데이터베이스
    
    ## 기술
    - 언어: JavaScript, Python, Java, TypeScript
    - 프론트엔드: React, Vue.js, HTML, CSS
    - 백엔드: Node.js, Django, Spring Boot
    - 데이터베이스: MySQL, PostgreSQL, MongoDB
    - 클라우드: AWS, GCP
    - 도구: Git, Docker, Kubernetes
    
    ## 프로젝트
    ### E-commerce 플랫폼 (2022.01 ~ 2022.06)
    온라인 쇼핑몰 개발 프로젝트
    기술: React, Node.js, MongoDB, AWS
    역할: 프론트엔드 개발 담당
    URL: https://github.com/example/ecommerce
    
    ### 실시간 채팅 앱 (2021.06 ~ 2021.12)
    WebSocket을 이용한 실시간 채팅 애플리케이션
    기술: Socket.io, React, Node.js
    역할: 풀스택 개발
    
    ## 자격증
    AWS Solutions Architect - Associate
    발급기관: Amazon Web Services
    취득일: 2021.03
    만료일: 2024.03
    자격증 ID: AWS-SAA-123456
    
    정보처리기사
    발급기관: 한국산업인력공단
    취득일: 2020.11
    
    ## 언어
    - 한국어 (원어민)
    - 영어 (비즈니스 레벨)
    - 일본어 (초급)
    """


@pytest.fixture
def sample_html_content():
    """샘플 HTML 이력서 컨텐츠"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>김철수 이력서</title>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background-color: #f0f0f0; }
        </style>
    </head>
    <body>
        <nav>네비게이션 메뉴</nav>
        <header class="header">
            <h1>김철수</h1>
            <p>소프트웨어 엔지니어</p>
        </header>
        
        <main>
            <section>
                <h2>연락처</h2>
                <ul>
                    <li>이메일: kim@example.com</li>
                    <li>전화: 010-9876-5432</li>
                    <li>GitHub: github.com/kimchulsu</li>
                </ul>
            </section>
            
            <section>
                <h2>경력</h2>
                <div>
                    <h3>테크 회사 - 선임 개발자 (2021 - 현재)</h3>
                    <p>웹 애플리케이션 개발 및 팀 리드</p>
                </div>
            </section>
            
            <section>
                <h2>기술</h2>
                <p>JavaScript, Python, React, Django</p>
            </section>
        </main>
        
        <footer>
            <p>© 2024 김철수</p>
        </footer>
        
        <script>
            console.log('이력서 페이지 로딩 완료');
        </script>
    </body>
    </html>
    """


@pytest.fixture
def mock_langextract_processor():
    """Mock LangExtract 프로세서"""
    return Mock()
