#!/usr/bin/env node

// 간단한 빌드 스크립트
const { execSync } = require('child_process')

try {
  console.log('🔨 Building...')
  execSync('babel src/index.js -o dist/index.js', { stdio: 'inherit' })
  console.log('✅ Build complete!')
} catch (error) {
  console.error('❌ Build failed!')
  process.exit(1)
}
