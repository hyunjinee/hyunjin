import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithRef } from 'react'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
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
