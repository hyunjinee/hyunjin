'use client'

export function InteractiveButton() {
  return (
    <button
      onClick={() => alert('MDX에서 이벤트 핸들러도 작동합니다!')}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      클릭해보세요
    </button>
  )
}
