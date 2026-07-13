import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { rehypeCopyButton } from './src/lib/rehypeCopyButton.ts'
import { rehypeMermaidPlaceholder } from './src/lib/rehypeMermaidPlaceholder.ts'

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
  // out/(구 Next 정적 export)과 동일하게 페이지를 <route>.html 파일로 낸다(디렉터리+index.html 아님).
  // 배포 계층(Cloudflare Workers Static Assets)의 html_handling 기본값(auto-trailing-slash)이
  // 디렉터리 형식(x/index.html)에는 /x → /x/ 307을 붙이는데, canonical·sitemap·내부 링크가 전부
  // 무슬래시라 이 형식으로는 전 페이지가 리다이렉트를 거친다 — trailingSlash:'never'와 짝을 이루는
  // 공식 권장 조합.
  build: { format: 'file' },
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
    // @astrojs/mdx가 markdownConfigDefaults.smartypants(기본 true)로 곧은따옴표를 curly quote로
    // 바꾼다 — 구 Next/contentlayer2 산출물과의 본문 패리티를 위해 끈다(리뷰 확정, out은 straight quote).
    smartypants: false,
    processor: unified({
      // remarkCjkFriendly: 한글 조사가 바로 붙는 강조(**단어**는)가 CommonMark flanking 규칙에 걸려
      // 리터럴 **로 남는 CJK 문제 대응 — 원본 contentlayer.config.ts도 포함하던 플러그인(리뷰 확정).
      remarkPlugins: [remarkGfm, remarkMath, remarkCjkFriendly],
      rehypePlugins: [
        rehypeStripLayoutFrontmatter,
        // mermaid 펜스 → data-mermaid-code 플레이스홀더 치환. rehypePrismPlus가 code 텍스트를
        // <span>들로 쪼개기 전에 원문을 뽑아야 하므로 반드시 먼저 온다.
        rehypeMermaidPlaceholder,
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
        // 코드 블록 복사 버튼 마크업 주입. prism이 pre에 language-* 클래스를 붙인 뒤에 와야 한다.
        rehypeCopyButton,
      ],
    }),
  },
})
