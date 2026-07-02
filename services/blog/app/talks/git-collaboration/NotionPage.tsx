'use client'

import 'react-notion-x/src/styles.css'
import type { ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'

export default function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionRenderer recordMap={recordMap} fullPage={false} darkMode />
}
