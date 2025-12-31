import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from './components/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from './components/Image'
import CustomLink from './components/Link'
import TableWrapper from './components/TableWrapper'
import { highlight } from 'sugar-high'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기본 HTML 요소
    h1: (props) => <h1 className="pt-12 mb-0 font-medium" {...props} />,
    h2: (props) => <h2 className="mt-8 mb-3 font-medium text-gray-800 dark:text-zinc-200" {...props} />,
    h3: (props) => <h3 className="mt-8 mb-3 font-medium text-gray-800 dark:text-zinc-200" {...props} />,
    h4: (props) => <h4 className="font-medium" {...props} />,
    p: (props) => <p className="leading-snug text-gray-800 dark:text-zinc-300" {...props} />,
    ol: (props) => <ol className="pl-5 space-y-2 list-decimal text-gray-800 dark:text-zinc-300" {...props} />,
    ul: (props) => <ul className="pl-5 space-y-1 list-disc text-gray-800 dark:text-zinc-300" {...props} />,
    li: (props) => <li className="pl-1" {...props} />,
    em: (props) => <em className="font-medium" {...props} />,
    strong: (props) => <strong className="font-medium" {...props} />,
    a: ({ href, children, ...props }) => {
      const className =
        'text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800'
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className={className} {...props}>
            {children}
          </Link>
        )
      }
      if (href?.startsWith('#')) {
        return (
          <a href={href} className={className} {...props}>
            {children}
          </a>
        )
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
          {children}
        </a>
      )
    },
    // 커스텀 컴포넌트
    Image,
    TOCInline,
    // a: CustomLink,
    pre: Pre,
    // table: TableWrapper,
    BlogNewsletterForm,

    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      // 인라인 코드인지 확인 (className이 없으면 인라인 코드)
      // const isInline = !props.className

      // if (isInline) {
      //   // 인라인 코드는 하이라이팅 없이 기본 스타일만 적용
      //   return (
      //     <code
      //       className="rounded bg-gray-100 px-1 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      //       {...props}
      //     >
      //       {children}
      //     </code>
      //   )
      // }

      // 코드 블록은 sugar-high로 하이라이팅
      const codeString = typeof children === 'string' ? children : String(children)
      const codeHTML = highlight(codeString)

      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },

    Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
      <table
        style={{
          display: 'block',
          maxWidth: 'fit-content',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    blockquote: (props) => (
      <blockquote
        className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
        {...props}
      />
    ),

    // 전달받은 컴포넌트 병합
    ...components,
  }
}

// declare global {
//   type MDXProvidedComponents = typeof components
// }

// export function useMDXComponents(): MDXProvidedComponents {
//   return components
// }
