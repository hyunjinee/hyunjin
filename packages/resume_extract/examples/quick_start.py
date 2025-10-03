#!/usr/bin/env python3
import os
from resume_extract import ResumeExtractor

def main():
    # 샘플 텍스트로 테스트
    sample_text = """
    이현진
    이메일: chulsoo.kim@example.com
    전화: 010-1234-5678
    주소: 서울특별시 강남구
    
    ## 경력
    토스뱅크 - 소프트웨어 엔지니어 (2023.09 ~ 2024.04)
    - React, Node.js를 이용한 웹 애플리케이션 개발
    
    ## 학력
    서울대학교 컴퓨터공학과 학사 (2016.03 ~ 2020.02)
    
    ## 기술
    JavaScript, React, Node.js, Python, AWS
    """
    
    print("\n🚀 이력서 정보 추출 시작...")
    
    try:
        with ResumeExtractor() as extractor:
            result = extractor.extract_from_text(sample_text)
            
            print("\n✅ 추출 결과:")
            print(f"👤 이름: {result.name or '미확인'}")
            print(f"📧 이메일: {result.contact.email or '미확인'}")
            print(f"📱 전화번호: {result.contact.phone or '미확인'}")
            print(f"🏠 주소: {result.contact.address or '미확인'}")
            
            if result.skills:
                print(f"🛠️  기술: {', '.join(result.skills)}")
            
            if result.experience:
                print(f"💼 경력: {len(result.experience)}개")
                for i, exp in enumerate(result.experience, 1):
                    print(f"   {i}. {exp.company} - {exp.position}")
            
            print(f"📊 신뢰도: {result.confidence_score or 'N/A'}")
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

if __name__ == "__main__":
    main()
