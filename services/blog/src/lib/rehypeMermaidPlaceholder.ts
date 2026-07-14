// components/Mermaid.tsx(React, useEffect + mermaid.run) 대응.
// ```mermaid 펜스는 자바스크립트 없이 그릴 수 없으므로, rehypePrismPlus가 code 텍스트를
// <span class="code-line">들로 쪼개기 전에 원문(raw, 이스케이프 없음)을 뽑아 정적 <pre>를
// data-mermaid-code 속성을 가진 빈 <div>로 치환해둔다. 실제 렌더는 위임 island
// (src/components/mdx/Mermaid.tsx, client:visible)가 document.querySelectorAll로 찾아서 처리한다.
// astro.config.mjs의 rehypePlugins 배열에서 rehypePrismPlus보다 앞에 와야 한다.
interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(textOf).join('')
}

export function rehypeMermaidPlaceholder() {
  return (tree: HastNode) => {
    const matches: Array<{ parent: HastNode; index: number; code: string }> = []

    const visit = (node: HastNode) => {
      const children = node.children ?? []
      children.forEach((child, index) => {
        const grandchild = child.tagName === 'pre' && child.children?.length === 1 ? child.children[0] : undefined
        if (child.type === 'element' && grandchild?.type === 'element' && grandchild.tagName === 'code') {
          const className = (grandchild.properties?.className as string[] | undefined) ?? []
          if (className.includes('language-mermaid')) {
            matches.push({ parent: node, index, code: textOf(grandchild) })
          }
        }
        visit(child)
      })
    }
    visit(tree)

    for (const { parent, index, code } of matches) {
      parent.children![index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid', 'flex', 'justify-center'], 'data-mermaid-code': code },
        children: [],
      }
    }
  }
}
