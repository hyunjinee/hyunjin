import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

// heroicon mini link — contentlayer.config.ts의 rehypeAutolinkHeadings content와 동일
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true },
)

// ponytail: frontmatter의 `layout`(PostLayout/PostSimple/PostBanner 문자열, contentlayer의 레이아웃 선택자)을
// @astrojs/mdx가 import 경로로 오해해 빌드가 깨진다 (frontmatter.layout → `import X from "PostSimple"`).
// rehypeApplyFrontmatterExport가 읽기 전에 vfile.data에서 지워 무력화한다.
// 업그레이드 경로: 실제 MDX 렌더링을 붙이는 태스크에서 컬렉션 전용 렌더 파이프라인으로 대체.
function rehypeStripLayoutFrontmatter() {
  return (_tree, vfile) => {
    if (vfile.data.astro?.frontmatter) delete vfile.data.astro.frontmatter.layout
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://hyunjinlee.com',
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeStripLayoutFrontmatter,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
    ],
  },
})
