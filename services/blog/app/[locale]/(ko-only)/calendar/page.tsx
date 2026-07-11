import { genPageMetadata } from 'app/seo'
import { events } from '@/data/eventsData'
import CalendarView from './CalendarView'

export const metadata = genPageMetadata({ title: 'Calendar', path: '/calendar' })

export default function CalendarPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:leading-14">
          Calendar
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">일정 모음</p>
      </div>
      <div className="container py-8">
        <CalendarView events={events} />
      </div>
    </div>
  )
}
