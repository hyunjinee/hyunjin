// GitHub 공개 기여 캘린더를 연도별로 받아 data/githubContributions.json 에 저장한다.
// 실행: node scripts/github-contributions.mjs (연도 추가 시 YEARS 수정)
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const USER = 'jin-2-kakaoent'
const YEARS = [2026, 2025, 2024]

async function fetchYear(year) {
  const res = await fetch(`https://github.com/users/${USER}/contributions?from=${year}-01-01&to=${year}-12-31`)
  if (!res.ok) throw new Error(`${year}: HTTP ${res.status}`)
  const html = await res.text()

  const counts = new Map()
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const m = /^([\d,]+) contribution/.exec(text)
    counts.set(id, m ? Number(m[1].replaceAll(',', '')) : 0)
  }

  const days = []
  for (const [, date, id, level] of html.matchAll(
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="(\d)"[^>]*>/g
  )) {
    days.push({ date, count: counts.get(id) ?? 0, level: Number(level) })
  }
  days.sort((a, b) => a.date.localeCompare(b.date))
  return days
}

const today = new Date().toISOString().slice(0, 10)
const years = []
for (const year of YEARS) {
  const days = (await fetchYear(year)).filter((d) => d.date <= today)
  const total = days.reduce((s, d) => s + d.count, 0)
  years.push({ year, total, days })
  console.log(`${year}: ${total} contributions (${days.length} days)`)
}

const out = path.join(import.meta.dirname, '../data/githubContributions.json')
writeFileSync(out, `${JSON.stringify({ user: USER, updated: today, years })}\n`)
console.log(`written: ${out}`)
