import { execSync } from 'child_process'
import rss from './rss.mjs'

// 빌드 산출물에 /ko 프리픽스가 새는 회귀를 영구 차단하는 게이트
function assertNoLocaleLeak() {
  const dir = '.next/server/app'
  const checks = [
    ['hyunjinlee.com/ko', 'canonical·og:url에 /ko 프리픽스가 샜다'],
    ['href="/en/ko', 'link href에 /en/ko 이중 프리픽스가 샜다'],
  ]
  for (const [needle, msg] of checks) {
    let hits = ''
    try {
      // grep은 매치 없으면 exit 1 → 정상 케이스이므로 삼킨다
      hits = execSync(`grep -rl ${JSON.stringify(needle)} ${dir}`, { encoding: 'utf8' }).trim()
    } catch {
      hits = ''
    }
    if (hits) {
      console.error(`✗ postbuild 게이트 실패: ${msg}\n${hits}`)
      process.exit(1)
    }
  }
  console.log('✓ postbuild 게이트 통과: /ko 프리픽스 누출 없음')
}

async function postbuild() {
  await rss()
  assertNoLocaleLeak()
}

postbuild()
