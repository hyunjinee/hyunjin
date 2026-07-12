import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is cloud.umami.is vercel.live unpkg.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src 'self' giscus.app vercel.live codesandbox.io *.codesandbox.io www.youtube-nocookie.com www.youtube.com www.google.com maps.google.com;
  worker-src 'self' blob:;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined

const config: NextConfig = {
  output,
  basePath,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'velog.velcdn.com',
      },
    ],
    // static export엔 이미지 최적화 서버가 없음
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config) => {
    config.module?.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
}

// MDX 설정 - Turbopack 사용 여부에 따라 플러그인 조건부 적용
const isTurbopack =
  process.argv.includes('--turbo') || (!process.argv.includes('--turbo=false') && process.env.TURBOPACK !== 'false')

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: isTurbopack
    ? {
        // Turbopack에서는 직렬화 가능한 기본 설정만 사용
        remarkPlugins: [],
        rehypePlugins: [],
      }
    : {
        // Webpack에서는 모든 플러그인 사용
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeKatex,
          [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
        ],
      },
})

// ponytail: withContentlayer(next-contentlayer2)의 webpack 플러그인은 Turbopack(dev/build 둘 다) 하에서 무동작 —
// 콘텐츠 생성은 이미 package.json의 `contentlayer2 build`/`contentlayer2 dev` CLI 호출이 전담한다.
// Turbopack 전용 워크플로가 아니게 되면 (예: `dev:no-turbo`에서 webpack 기반 자동 재생성이 필요해지면)
// withContentlayer 재도입을 검토할 것.
export default withBundleAnalyzer(withMDX(config))
