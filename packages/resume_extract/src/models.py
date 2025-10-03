"""
Data models for storing resume information
"""

from typing import List, Optional, Union
from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactInfo(BaseModel):
    """연락처 정보"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None


class ExperienceInfo(BaseModel):
    """경력 정보"""
    company: str
    position: str
    duration: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    

class EducationInfo(BaseModel):
    """학력 정보"""
    institution: str
    degree: str 
    major: Optional[str] = None
    duration: str
    gpa: Optional[str] = None
    description: Optional[str] = None


class ProjectInfo(BaseModel):
    """프로젝트 정보"""
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    duration: Optional[str] = None
    url: Optional[str] = None
    role: Optional[str] = None


class CertificationInfo(BaseModel):
    """자격증 정보"""
    name: str
    issuer: str
    date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    url: Optional[str] = None


class ResumeInfo(BaseModel):
    """전체 이력서 정보"""
    name: Optional[str] = None
    contact: ContactInfo = Field(default_factory=ContactInfo)
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[ExperienceInfo] = Field(default_factory=list)
    education: List[EducationInfo] = Field(default_factory=list)
    projects: List[ProjectInfo] = Field(default_factory=list)
    certifications: List[CertificationInfo] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    raw_text: Optional[str] = None
    confidence_score: Optional[float] = None

    @field_validator('confidence_score')
    @classmethod
    def validate_confidence_score(cls, v):
        if v is not None and not (0.0 <= v <= 1.0):
            raise ValueError('Confidence score must be between 0.0 and 1.0')
        return v

    def to_dict(self) -> dict:
        """딕셔너리로 변환"""
        return self.model_dump()

    def to_json(self) -> str:
        """JSON 문자열로 변환"""
        return self.model_dump_json(indent=2)
