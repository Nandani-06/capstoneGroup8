'use client'

import { useState } from 'react'

interface Props {
  onFilterChange: (filters: Record<string, string>) => void
}

const searchableFields = [
  'first_name', 'last_name', 'sex', 'email', 'email_2', 'teacher_category',
  'tags', 'phone', 'mobile', 'school_name', 'school_category',
  'industry', 'file_name', 'sheet_name'
]

// create a mapping of field names to display names
const fieldDisplayNames: Record<string, string> = {
   'sex': 'gender'
}
  
// get and display name for each field
const getDisplayName = (field: string) => {
  return fieldDisplayNames[field] || field
}

export default function EfpSearchFilterBar({ onFilterChange }: Props) {
  const [conditions, setConditions] = useState([{ field: '', value: '' }])

  const handleChange = (index: number, key: 'field' | 'value', val: string) => {
    const updated = [...conditions]
    updated[index][key] = val
    setConditions(updated)
  }

  const addCondition = () => {
    setConditions([...conditions, { field: '', value: '' }])
  }

  const removeCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filter: Record<string, string> = {}
    conditions.forEach(({ field, value }) => {
      if (field && value) filter[field] = value.trim()
    })
    onFilterChange(filter)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {conditions.map((cond, index) => (
        <div key={index} className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Field</label>
            <select
              value={cond.field}
              onChange={e => handleChange(index, 'field', e.target.value)}
              className="px-3 py-2 border rounded text-sm"
            >
              <option value="">Select field</option>
              {searchableFields.map(field => (
                <option key={field} value={field}>
                  {getDisplayName(field)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={cond.value}
              onChange={e => handleChange(index, 'value', e.target.value)}
              className="px-3 py-2 border rounded text-sm"
              placeholder="Enter value"
            />
          </div>

          <button
            type="button"
            onClick={() => removeCondition(index)}
            className="mt-6 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            disabled={conditions.length === 1}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addCondition}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          + Add Condition
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
    </form>
  )
}