import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
// @ts-ignore
const colors = require('./colors')

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      width: {
        toast: 'min(900px, 100vw - 40px)',
        'toast-body': 'calc(100% - 60px)',
        'toast-title': 'calc(100% - 40px)',
      },
      height: {
        content: 'calc(100vh - 45px)',
        monaco: 'calc(100vh - 93px)',
        monaco_small: 'calc(100vh - 129px)',
      },
      fontFamily: {
        sans: ['Optimistic Display', '-apple-system', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

export default config
