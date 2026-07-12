import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// incrementalCache 누락 = SSG가 매 요청 SSR 폴백 + 500 — 가장 흔한 마이그레이션 함정 (ADR-0003)
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
