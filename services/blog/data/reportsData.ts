type Report = {
  title: string
  period: { from: string; to: string }
  sessions: number
  messages: number
  slug: string
}

export const reports: Report[] = [
  {
    title: 'Claude Code Insights Report',
    period: { from: '2026-02-09', to: '2026-03-11' },
    sessions: 307,
    messages: 2305,
    slug: '2026-02-09_2026-03-11',
  },
  {
    title: 'Claude Code Insights Report',
    period: { from: '2026-02-05', to: '2026-03-05' },
    sessions: 245,
    messages: 2063,
    slug: '2026-02-05_2026-03-05',
  },
]
