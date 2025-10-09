#!/usr/bin/env python3
"""
URL에서 이력서 정보 추출 예제
이민기님의 온라인 이력서를 테스트합니다.
"""
import os
from resume_extract import ResumeExtractor

def main():
    # 테스트할 이력서 URL
    resume_url = "https://resume.lapidix.dev/"
    
    print("\n🚀 URL에서 이력서 정보 추출 시작...")
    print(f"📋 URL: {resume_url}\n")
    
    try:
        with ResumeExtractor() as extractor:
            # URL에서 이력서 정보 추출
            result = extractor.extract_from_url(resume_url)
            
            # 기본 정보 출력
            print("=" * 60)
            print("✅ 추출 결과")
            print("=" * 60)
            print(f"\n👤 이름: {result.name or '미확인'}")
            
            # 연락처 정보
            if result.contact:
                print("\n📞 연락처 정보:")
                if result.contact.email:
                    print(f"   📧 이메일: {result.contact.email}")
                if result.contact.phone:
                    print(f"   📱 전화번호: {result.contact.phone}")
                if result.contact.address:
                    print(f"   🏠 주소: {result.contact.address}")
                if result.contact.linkedin:
                    print(f"   🔗 LinkedIn: {result.contact.linkedin}")
                if result.contact.github:
                    print(f"   🔗 GitHub: {result.contact.github}")
                if result.contact.website:
                    print(f"   🔗 Website: {result.contact.website}")
            
            # # 학력 정보
            # if result.education:
            #     print(f"\n🎓 학력: {len(result.education)}개")
            #     for i, edu in enumerate(result.education, 1):
            #         print(f"   {i}. {edu.institution or '미확인'}")
            #         if edu.degree:
            #             print(f"      학위: {edu.degree}")
            #         if edu.field_of_study:
            #             print(f"      전공: {edu.field_of_study}")
            #         if edu.start_date or edu.end_date:
            #             period = f"{edu.start_date or '미확인'} ~ {edu.end_date or '미확인'}"
            #             print(f"      기간: {period}")
            
            # # 경력 정보
            # if result.experience:
            #     print(f"\n💼 경력: {len(result.experience)}개")
            #     for i, exp in enumerate(result.experience, 1):
            #         print(f"   {i}. {exp.company or '미확인'}")
            #         if exp.position:
            #             print(f"      직책: {exp.position}")
            #         if exp.start_date or exp.end_date:
            #             period = f"{exp.start_date or '미확인'} ~ {exp.end_date or '미확인'}"
            #             print(f"      기간: {period}")
            #         if exp.description:
            #             print(f"      설명: {exp.description[:100]}...")
            
            # 기술 스택
            if result.skills:
                print(f"\n🛠️  기술 스택 ({len(result.skills)}개):")
                # 최대 20개까지만 표시
                skills_to_show = result.skills[:20]
                print(f"   {', '.join(skills_to_show)}")
                if len(result.skills) > 20:
                    print(f"   ... 외 {len(result.skills) - 20}개")
            
            # 프로젝트
            if result.projects:
                print(f"\n📂 프로젝트: {len(result.projects)}개")
                for i, proj in enumerate(result.projects, 1):
                    print(f"   {i}. {proj.name or '미확인'}")
                    if proj.description:
                        print(f"      설명: {proj.description[:100]}...")
            
            # 자격증/수상
            if result.certifications:
                print(f"\n🏆 자격증/수상: {len(result.certifications)}개")
                for i, cert in enumerate(result.certifications, 1):
                    print(f"   {i}. {cert.name or '미확인'}")
            
            # 요약
            if result.summary:
                print(f"\n📝 요약:")
                print(f"   {result.summary[:200]}...")
            
            # 신뢰도 점수
            if result.confidence_score:
                print(f"\n📊 신뢰도 점수: {result.confidence_score}")
            
            print("\n" + "=" * 60)
            print("✨ 추출 완료!")
            print("=" * 60)
            
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
