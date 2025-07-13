import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // 타입 정의 파일 생성 비활성화
  sourcemap: true,
  clean: true,
  minify: false,
  shims: true,
  target: 'es2017',
})