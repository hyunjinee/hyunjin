// components/Pre.tsx(React, useState hover/copied) 대응 — React 없이 rehype 단계에서
// 코드 블록마다 정적 복사 버튼 마크업만 주입한다. 클릭 처리·"복사됨" 피드백은
// Base.astro의 위임 인라인 스크립트 하나가 문서 전체 [data-copy-button]을 담당한다.
// (호버 표시는 CSS .group-hover, 복사됨 색상 전환은 css/code-highlight.css의 [data-copied] 규칙)
interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

const iconPath = (d: string): HastNode => ({
  type: 'element',
  tagName: 'path',
  properties: { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d },
  children: [],
})

const COPY_ICON: HastNode = {
  type: 'element',
  tagName: 'svg',
  properties: { viewBox: '0 0 24 24', stroke: 'currentColor', fill: 'none', className: ['copy-icon-copy'] },
  children: [
    iconPath(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    ),
  ],
}

const CHECK_ICON: HastNode = {
  type: 'element',
  tagName: 'svg',
  properties: { viewBox: '0 0 24 24', stroke: 'currentColor', fill: 'none', className: ['copy-icon-check'] },
  children: [
    iconPath(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  ],
}

const BUTTON_CLASS = [
  'copy-code-button',
  'absolute',
  'right-2',
  'top-2',
  'h-8',
  'w-8',
  'rounded',
  'border-2',
  'p-1',
  'opacity-0',
  'transition-all',
  'duration-200',
  'text-gray-600',
  'bg-gray-100',
  'border-gray-400',
  'hover:border-gray-500',
  'hover:bg-gray-200',
  'dark:border-gray-600',
  'dark:bg-gray-800',
  'dark:text-gray-300',
  'dark:hover:border-gray-500',
  'dark:hover:bg-gray-700',
  'group-hover:opacity-100',
  'focus:opacity-100',
]

export function rehypeCopyButton() {
  return (tree: HastNode) => {
    const matches: Array<{ parent: HastNode; index: number; pre: HastNode }> = []
    const visit = (node: HastNode) => {
      const children = node.children ?? []
      children.forEach((child, index) => {
        if (child.type === 'element' && child.tagName === 'pre') matches.push({ parent: node, index, pre: child })
        visit(child)
      })
    }
    visit(tree)

    for (const { parent, index, pre } of matches) {
      const button: HastNode = {
        type: 'element',
        tagName: 'button',
        properties: { type: 'button', 'data-copy-button': '', 'aria-label': 'Copy code', className: BUTTON_CLASS },
        children: [COPY_ICON, CHECK_ICON],
      }
      parent.children![index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['group', 'relative'] },
        children: [button, pre],
      }
    }
  }
}
