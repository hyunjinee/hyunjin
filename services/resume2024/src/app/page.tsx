import Header from '@/components/resume/Header'
import ExperienceSection from '@/components/resume/ExperienceSection'
import SkillsSection from '@/components/resume/SkillsSection'

export default function Resume() {
  return (
    <div className="bg-[#f5f5f5] relative w-full h-screen flex items-center justify-center print:p-0 print:bg-white overflow-hidden">
      <div className="max-w-[210mm] w-full h-full max-h-full bg-white shadow-lg print:shadow-none p-3 overflow-y-auto print:overflow-visible">
        <Header />
        <ExperienceSection />
        <SkillsSection />
      </div>
    </div>
  )
}
