import type { MDXComponents } from 'mdx/types'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from './components/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from './components/Image'
import CustomLink from './components/Link'
import TableWrapper from './components/TableWrapper'
import { highlight } from 'sugar-high'

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

    code: ({ children, ...props }: MDXComponents) => {
      const codeHTML = highlight(children as string)
      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },

    // 전달받은 컴포넌트 병합
    ...components,
  }
}

// import React, { ComponentPropsWithoutRef } from 'react'
// import Link from 'next/link'
// import { highlight } from 'sugar-high'

// type HeadingProps = ComponentPropsWithoutRef<'h1'>
// type ParagraphProps = ComponentPropsWithoutRef<'p'>
// type ListProps = ComponentPropsWithoutRef<'ul'>
// type ListItemProps = ComponentPropsWithoutRef<'li'>
// type AnchorProps = ComponentPropsWithoutRef<'a'>
// type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>

// const components = {
//   h1: (props: HeadingProps) => <h1 className="pt-12 mb-0 font-medium" {...props} />,
//   h2: (props: HeadingProps) => <h2 className="mt-8 mb-3 font-medium text-gray-800 dark:text-zinc-200" {...props} />,
//   h3: (props: HeadingProps) => <h3 className="mt-8 mb-3 font-medium text-gray-800 dark:text-zinc-200" {...props} />,
//   h4: (props: HeadingProps) => <h4 className="font-medium" {...props} />,
//   p: (props: ParagraphProps) => <p className="leading-snug text-gray-800 dark:text-zinc-300" {...props} />,
//   ol: (props: ListProps) => <ol className="pl-5 space-y-2 list-decimal text-gray-800 dark:text-zinc-300" {...props} />,
//   ul: (props: ListProps) => <ul className="pl-5 space-y-1 list-disc text-gray-800 dark:text-zinc-300" {...props} />,
//   li: (props: ListItemProps) => <li className="pl-1" {...props} />,
//   em: (props: ComponentPropsWithoutRef<'em'>) => <em className="font-medium" {...props} />,
//   strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-medium" {...props} />,
//   a: ({ href, children, ...props }: AnchorProps) => {
//     const className =
//       'text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800'
//     if (href?.startsWith('/')) {
//       return (
//         <Link href={href} className={className} {...props}>
//           {children}
//         </Link>
//       )
//     }
//     if (href?.startsWith('#')) {
//       return (
//         <a href={href} className={className} {...props}>
//           {children}
//         </a>
//       )
//     }
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
//         {children}
//       </a>
//     )
//   },
//   code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
//     const codeHTML = highlight(children as string)
//     return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
//   },
//   Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
//     <table>
//       <thead>
//         <tr>
//           {data.headers.map((header, index) => (
//             <th key={index}>{header}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.rows.map((row, index) => (
//           <tr key={index}>
//             {row.map((cell, cellIndex) => (
//               <td key={cellIndex}>{cell}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   ),
//   blockquote: (props: BlockquoteProps) => (
//     <blockquote
//       className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
//       {...props}
//     />
//   ),
// }

// declare global {
//   type MDXProvidedComponents = typeof components
// }

// export function useMDXComponents(): MDXProvidedComponents {
//   return components
// }
