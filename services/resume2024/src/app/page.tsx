import Header from '@/components/resume/Header'
import ExperienceSection from '@/components/resume/ExperienceSection'
import SkillsSection from '@/components/resume/SkillsSection'

export default function Resume() {
  return (
    <div className="bg-[#f5f5f5] relative w-full min-h-screen flex items-center justify-center py-8 px-4 md:p-8 print:p-0 print:bg-white">
      <div className="max-w-[210mm] w-full relative min-h-[297mm] bg-white shadow-lg print:shadow-none p-4 md:p-[1.5rem]">
        <Header />
        <ExperienceSection />
        <SkillsSection />
      </div>
    </div>
  )
}
