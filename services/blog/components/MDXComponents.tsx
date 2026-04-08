import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithRef } from 'react'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Mermaid from './Mermaid'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }
  return String(node ?? '')
}

function MdxPre(props: ComponentPropsWithRef<'pre'>) {
  const child = Array.isArray(props.children) ? props.children[0] : props.children
  if (child && typeof child === 'object' && 'props' in child) {
    const codeProps = (child as React.ReactElement<{ className?: string; children?: React.ReactNode }>).props
    if (codeProps.className?.includes('language-mermaid')) {
      return <Mermaid>{extractText(codeProps.children)}</Mermaid>
    }
  }
  return <Pre {...(props as { children: React.ReactNode })} />
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: MdxPre,
  table: TableWrapper,
  BlogNewsletterForm,
  h1: (props: ComponentPropsWithRef<'h1'>) => <h1 {...props} />,
  h2: (props: ComponentPropsWithRef<'h2'>) => <h2 {...props} />,
  h3: (props: ComponentPropsWithRef<'h3'>) => <h3 {...props} />,
  h4: (props: ComponentPropsWithRef<'h4'>) => <h4 {...props} />,
  p: (props: ComponentPropsWithRef<'p'>) => <p {...props} />,
  ol: (props: ComponentPropsWithRef<'ol'>) => <ol {...props} />,
  ul: (props: ComponentPropsWithRef<'ul'>) => <ul {...props} />,
  li: (props: ComponentPropsWithRef<'li'>) => <li {...props} />,
}
