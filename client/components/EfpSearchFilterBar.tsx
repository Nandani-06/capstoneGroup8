'use client'

import { useState } from 'react'

interface Props {
  filter: {
    q: string
    col: string
  }
  onFilterChange: (filter: { q: string; col: string }) => void
}

const searchableFields = [
  'first_name', 'last_name', 'sex', 'email', 'email_2', 'teacher_category',
  'tags', 'phone', 'mobile', 'school_name', 'school_category',
  'industry', 'file_name', 'sheet_name'
]

export default function EfpSearchFilterBar({ filter, onFilterChange }: Props) {
  const [searchText, setSearchText] = useState(filter.q)
  const [selectedCol, setSelectedCol] = useState(filter.col)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ q: searchText.trim(), col: selectedCol })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 items-end">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Search Term</label>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="px-3 py-2 border rounded w-64 text-sm"
          placeholder="Enter keyword..."
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Field</label>
        <select
          value={selectedCol}
          onChange={e => setSelectedCol(e.target.value)}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="">All fields</option>
          {searchableFields.map(field => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
      >
        Search
      </button>
    </form>
  )
}