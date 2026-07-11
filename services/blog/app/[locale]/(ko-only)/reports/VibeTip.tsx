'use client'

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
