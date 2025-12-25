import type { MDXComponents } from 'mdx/types'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from './components/Image'
import CustomLink from './components/Link'
import TableWrapper from './components/TableWrapper'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기본 HTML 요소
    h1: (props) => <h1 {...props} />,
    h2: (props) => <h2 {...props} />,
    h3: (props) => <h3 {...props} />,
    h4: (props) => <h4 {...props} />,
    p: (props) => <p {...props} />,
    ol: (props) => <ol {...props} />,
    ul: (props) => <ul {...props} />,
    li: (props) => <li {...props} />,

    // 커스텀 컴포넌트
    Image,
    TOCInline,
    a: CustomLink,
    pre: Pre,
    table: TableWrapper,
    BlogNewsletterForm,

    // 전달받은 컴포넌트 병합
    ...components,
  }
}
