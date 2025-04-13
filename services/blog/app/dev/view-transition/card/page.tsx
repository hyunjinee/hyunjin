'use client'

import Image from 'next/image'
import Link from 'next/link'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { PLACES } from '../utils/constants'
import { cx } from '../utils/cx'

function LeftSideMenu() {
  return (
    <div className="relative w-full overflow-hidden m-h-screen md:w-1/2 bg-emerald-200">
      <div className="top-0 bottom-0 left-0 flex flex-col p-8 md:absolute">
        <DynamicBackground />
        <div className="z-10 my-4">
          <ViewTransition name="experimental-label">
            <b className="inline-block text-gray-700">{`<ViewTransition>`}</b>
          </ViewTransition>
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-blue-gray-500 hover:underline">
              ← Back
            </Link>
          </div>
        </div>

        {/* sticker icon */}
        <div className="z-10 flex items-center gap-2 mb-4 text-gray-800">
          <ViewTransition name="sticker-icon">
            <Link href="/card/overview">
              <span className="flex items-center justify-center w-8 h-8 transition-all duration-150 bg-gray-800 rounded-full hover:scale-120" />
            </Link>
          </ViewTransition>
          <span className="font-medium">Las Ciudades</span>
        </div>

        <div className="z-10 flex flex-col justify-center flex-1">
          <h1 className="space-y-2 font-serif text-6xl">
            <div>
              Explore <span className="block font-serif text-4xl md:inline-block">The cities.</span>
            </div>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    // make this locate on top of the page when it's on mobile
    <div className="flex flex-col min-h-screen md:flex-row bg-red-50 ">
      {/* Left Section */}
      <ViewTransition name="left-side-bar">
        <LeftSideMenu />
      </ViewTransition>

      {/* Right Section */}
      <ViewTransition name="right-side-bar">
        <div className="w-full p-2 md:w-1/2 md:p-8">
          <h2 className="px-2 mt-4 text-xl font-medium text-gray-700">Spots</h2>
          <div className="flex flex-wrap gap-8 p-2 space-y-4">
            {PLACES.map((place) => (
              <Link
                key={place.id}
                href={`/card/${place.slug}`}
                className="hover:bg-gray-50 transition-colors w-full md:w-[300px] h-[300px] items-stretch"
              >
                <div className="relative flex-shrink-0 w-full h-full rounded-lg overflow-clip group">
                  <ViewTransition name={`place-image-${place.slug}`}>
                    <Image
                      loading="eager"
                      decoding="sync"
                      src={place.image || '/placeholder.svg'}
                      alt={place.name}
                      fill
                      className="flex-1 object-cover transition-transform rounded-lg overflow-clip group-hover:scale-110"
                    />
                  </ViewTransition>
                  {/* name label */}
                  <ViewTransition name={`place-name-${place.slug}`}>
                    <div className="absolute bottom-4 right-4 text-gray-100 bg-opacity-50 rounded-xl text-3xl filter [text-shadow:0px_0px_8px_#111]">
                      {place.name}
                    </div>
                  </ViewTransition>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ViewTransition>
    </div>
  )
}

function DynamicBackground({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'absolute w-96 h-96 bg-blue-500 opacity-50 blur-3xl top-20 left-1/4 transform rotate-12 skew-y-6 rounded-full',
        className,
      )}
    />
  )
}
