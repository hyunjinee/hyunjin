// app/[locale]/(ko-only)/reports/VibeTip.tsx 이식 (verbatim) — DOM에 위젯을 직접 꽂는 사이드이펙트 전용
// 컴포넌트(렌더 결과는 항상 null). ScrollTop.tsx 선례와 동일하게 client:load.
import { useEffect } from 'react'
import { init } from 'vibetip'

export default function VibeTip() {
  useEffect(() => {
    const tip = init({
      name: '이현진',
      message: '',
      links: ['https://qr.kakaopay.com/Ej8TSKM4J'],
      accent: '#FFEB00',
      position: 'bottom-right',
      theme: 'auto',
    })
    return () => tip.destroy()
  }, [])

  return null
}
