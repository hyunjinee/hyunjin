import { useEffect, useState } from 'react'

// next-themes 없이 html.dark 클래스(Base.astro FOUC 스크립트·ThemeSwitch가 토글)를 관찰한다.
// Mermaid·NotionPage 등 다크모드에 반응해야 하는 island이 소비.
export function useThemeClass(): 'light' | 'dark' {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    const el = document.documentElement
    setIsDark(el.classList.contains('dark'))
    const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')))
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark ? 'dark' : 'light'
}
