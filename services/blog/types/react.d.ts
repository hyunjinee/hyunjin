// React Canary ViewTransition API 타입 정의
import 'react'

declare module 'react' {
  interface ViewTransitionProps {
    children: ReactNode
    name?: string
    default?: string | Record<string, string>
    enter?: string | Record<string, string>
    exit?: string | Record<string, string>
    update?: string | Record<string, string>
    share?: string | Record<string, string>
  }

  export const ViewTransition: React.FC<ViewTransitionProps>
}
