// components/InteractiveButton.tsx 이식 — src/pages/test-mdx.mdx(URL 계약 /test-mdx) 전용 데모 버튼.
export function InteractiveButton() {
  return (
    <button
      type="button"
      onClick={() => alert('MDX에서 이벤트 핸들러도 작동합니다!')}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      클릭해보세요
    </button>
  )
}
