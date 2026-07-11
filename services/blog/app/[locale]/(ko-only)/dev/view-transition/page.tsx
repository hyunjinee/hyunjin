import Link from 'next/link'
import { ViewTransition } from 'react'

export default function Page() {
  return (
    <div className="p-4 max-w-[960px] m-auto">
      <h1 className="py-8 text-4xl font-medium">View Transition Next.js Examples</h1>
      <p>
        <span className="mr-2">
          {`Use React `}
          <b className="text-blue-400">{`Experimental `}</b>
          <ViewTransition name="experimental-label">
            <span className="inline-block font-bold text-gray-700">{`<ViewTransitions>`}</span>
          </ViewTransition>
          {` API in Next.js.`}
        </span>
      </p>

      <div data-support className="w-full my-2 text-sm">
        <p data-support-no className="px-2 py-1 text-red-500 bg-red-100 rounded-lg">
          {'🔴 <ViewTransition> might not work well on your browser'}
        </p>
        <p data-support-yes className="px-2 py-1 text-green-600 bg-green-100 rounded-lg">
          🟢 Your browser supports View Transitions.
        </p>
      </div>

      <ul className="flex flex-col justify-center py-8 m-auto">
        <li className="py-2">
          <h2 className="text-xl underline">
            <Link href="/dev/view-transition/">{`Floating Elements Transition`}</Link>
          </h2>
        </li>

        <li className="py-2">
          <h2 className="text-xl underline">
            <Link href="/dev/view-transition/card">{`Transform Card Transition`}</Link>
          </h2>
        </li>
      </ul>
    </div>
  )
}
