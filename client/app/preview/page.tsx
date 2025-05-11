'use client'

import { useState } from 'react'
import EfpSearchFilterBar from '@/components/EfpSearchFilterBar'
import EfpPreviewTable from '@/components/EfpPreviewTable'

export default function PreviewPage() {
  const [filter, setFilter] = useState<Record<string, string>>({})

  return (
    <div>
      <EfpSearchFilterBar filter={filter} onFilterChange={setFilter} />
      <EfpPreviewTable filter={filter} />
    </div>
  )
}
