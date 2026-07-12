// components/MDXComponents.tsx 이식. <Content components={mdxComponents} /> (render()의 components prop)로 전달한다.
// 원본에 있었지만 실제 글 본문에서 JSX로 쓰인 적 없는 Image/TOCInline/BlogNewsletterForm, 항등 함수뿐이던
// h1~h4/p/ol/ul/li 매핑은 제외했다 (data/blog/**/*.mdx grep 확인). pre는 rehype(복사 버튼·mermaid 플레이스홀더)가
// 빌드 타임에 정적으로 처리하므로 여기서 다루지 않는다.
import Link from '../Link.astro'
import TableWrapper from './TableWrapper.astro'

export const mdxComponents = {
  a: Link,
  table: TableWrapper,
}
