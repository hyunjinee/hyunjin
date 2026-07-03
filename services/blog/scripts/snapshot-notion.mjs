// 일회성: Git 협업 강의 Notion 페이지를 로컬 스냅샷으로 저장
// - recordMap JSON → app/talks/git-collaboration/records/<id>.json
// - 본문 이미지(만료되는 signed URL) → public/talks/git-collaboration/notion/<hash>.<ext>
// 실행: node scripts/snapshot-notion.mjs
import { NotionAPI } from 'notion-client'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MATERIALS = [
  { id: '1', pageId: 'fd8cb76dbad04aa3875d92fd2e577e81' },
  { id: '2', pageId: '2f661351c2a043c398d666706c263c40' },
  { id: '3', pageId: '00ba3dc398b74076a6e6e0b87d7a6691' },
  { id: '4', pageId: 'd7f403f439174b7faddc42aeb1d2ba3c' },
  { id: '5', pageId: 'e51a5fcd1ce149468cdfd0a35286b9ee' },
  { id: 'commands', pageId: 'ce601af4c1f64bb39fe7378b6d88f9aa' },
]

const RECORDS_DIR = 'app/talks/git-collaboration/records'
const IMAGES_DIR = 'public/talks/git-collaboration/notion'
const IMAGES_URL = '/talks/git-collaboration/notion'

const extFromContentType = (ct) =>
  ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg' })[
    ct?.split(';')[0]
  ] ?? 'png'

await mkdir(RECORDS_DIR, { recursive: true })
await mkdir(IMAGES_DIR, { recursive: true })

const api = new NotionAPI()

for (const { id, pageId } of MATERIALS) {
  const recordMap = await api.getPage(pageId)
  let json = JSON.stringify(recordMap)

  // 다운로드 대상: signed_urls(본문 이미지) + 페이지 아이콘 등 file.notion.so/secure.notion-static URL
  const urls = new Set(Object.values(recordMap.signed_urls ?? {}))
  for (const m of json.matchAll(/https:\\\/\\\/file\.notion\.so\\\/[^"]+/g)) {
    urls.add(JSON.parse(`"${m[0]}"`))
  }

  for (const url of urls) {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  skip ${res.status}: ${url.slice(0, 80)}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const name = `${createHash('sha1').update(url.split('?')[0]).digest('hex').slice(0, 12)}.${extFromContentType(res.headers.get('content-type'))}`
    await writeFile(path.join(IMAGES_DIR, name), buf)
    json = json.replaceAll(JSON.stringify(url).slice(1, -1), `${IMAGES_URL}/${name}`)
  }

  await writeFile(path.join(RECORDS_DIR, `${id}.json`), json)
  console.log(`${id}: ${(json.length / 1024).toFixed(0)}KB, images ${urls.size}`)
}
console.log('done')
