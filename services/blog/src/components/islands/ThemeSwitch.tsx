import { Menu, RadioGroup, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

// next-themes 대신 Base.astro의 FOUC 인라인 스크립트와 동일한 localStorage 'theme' 키를 직접 다룬다.
// 저장 값 계약(next-themes 호환): 'light' | 'dark' | 'system'.
type ThemePreference = 'light' | 'dark' | 'system'

// ponytail: data/siteMetadata.js의 `theme: 'dark'`와 동일 값. next-themes의 defaultTheme prop이 하던 역할.
// 값이 바뀌면 이 상수도 함께 바꿔야 한다 (client 번들에 CJS siteMetadata를 끌어오지 않기 위한 트레이드오프).
const DEFAULT_THEME: ThemePreference = 'dark'

function resolveIsDark(pref: ThemePreference): boolean {
  if (pref === 'dark') return true
  if (pref === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(pref: ThemePreference) {
  localStorage.setItem('theme', pref)
  document.documentElement.classList.toggle('dark', resolveIsDark(pref))
}

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6 group:hover:text-gray-100"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)
const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6 group:hover:text-gray-100"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)
const Monitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 group:hover:text-gray-100"
  >
    <rect x="3" y="3" width="14" height="10" rx="2" ry="2"></rect>
    <line x1="7" y1="17" x2="13" y2="17"></line>
    <line x1="10" y1="13" x2="10" y2="17"></line>
  </svg>
)
const Blank = () => <svg className="w-6 h-6" />

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemePreference>(DEFAULT_THEME)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as ThemePreference | null) ?? DEFAULT_THEME
    setTheme(stored)
    setIsDark(document.documentElement.classList.contains('dark'))
    setMounted(true)
  }, [])

  // theme === 'system'일 때만 OS 변경을 실시간 반영 (next-themes의 시스템 리스너 대응)
  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
      setIsDark(resolveIsDark('system'))
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [theme])

  const onSelect = (pref: ThemePreference) => {
    applyTheme(pref)
    setTheme(pref)
    setIsDark(resolveIsDark(pref))
  }

  return (
    <div className="flex items-center mr-5">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center justify-center hover:text-primary-500 dark:hover:text-primary-400">
          <Menu.Button aria-label="Theme switcher">{mounted ? isDark ? <Moon /> : <Sun /> : <Blank />}</Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
            <RadioGroup value={theme} onChange={onSelect}>
              <div className="p-1">
                <RadioGroup.Option value="light">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary-600 text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <div className="mr-2">
                          <Sun />
                        </div>
                        Light
                      </button>
                    )}
                  </Menu.Item>
                </RadioGroup.Option>
                <RadioGroup.Option value="dark">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary-600 text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <div className="mr-2">
                          <Moon />
                        </div>
                        Dark
                      </button>
                    )}
                  </Menu.Item>
                </RadioGroup.Option>
                <RadioGroup.Option value="system">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-primary-600 text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <div className="mr-2">
                          <Monitor />
                        </div>
                        System
                      </button>
                    )}
                  </Menu.Item>
                </RadioGroup.Option>
              </div>
            </RadioGroup>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ThemeSwitch
