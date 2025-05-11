'use client'

import { useEffect, useState } from 'react'

interface EfpItem {
  id: number
  first_name: string | null
  last_name: string | null
  sex: string | null
  email: string | null
  email_2: string | null
  teacher_category: string | null
  tags: string | null
  phone: string | null
  mobile: string | null
  school_name: string | null
  school_category: string | null
  industry: string | null
  file_name: string | null
  sheet_name: string | null
}

interface Props {
  filter: Record<string, string>
}

const PAGE_SIZE = 15

export default function EfpPreviewTable({ filter }: Props) {
  const [data, setData] = useState<EfpItem[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const paginatedData = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const allFields = [
    "id", "first_name", "last_name", "sex", "email", "email_2", "teacher_category",
    "tags", "phone", "mobile", "school_name", "school_category",
    "industry", "file_name", "sheet_name"
  ]

  useEffect(() => {
    setLoading(true)
    setError(null)

    const hasFilter = Object.values(filter).some(v => v.trim() !== '')

    let fetchUrl = ''
    if (hasFilter) {
      const url = new URL('http://127.0.0.1:8000/api/search-efp-advanced')
      Object.entries(filter).forEach(([key, val]) => {
        if (val.trim()) url.searchParams.append(key, val.trim())
      })
      fetchUrl = url.toString()
    } else {
      fetchUrl = 'http://127.0.0.1:8000/api/efp/'
    }

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        setData(json)
        setSelectedIds([])
        setCurrentPage(1)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [filter])

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    const allIds = data.map(item => item.id)
    setSelectedIds(allIds)
  }

  const deselectAll = () => {
    setSelectedIds([])
  }

  const confirmAndDelete = async () => {
    if (selectedIds.length === 0) return
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected entries?`)
    if (!confirmed) return

    const res = await fetch('http://127.0.0.1:8000/api/efp/delete-bulk/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    })

    if (res.ok) {
      setData(prev => prev.filter(item => !selectedIds.includes(item.id)))
      setSelectedIds([])
    } else {
      alert('Failed to delete. Please try again.')
    }
  }

  const handleUpdateTags = async () => {
    if (!tagInput.trim() || selectedIds.length === 0) return
    const confirmed = window.confirm(`Append tag "${tagInput}" to ${selectedIds.length} selected entries?`)
    if (!confirmed) return

    const updates = selectedIds.map(id => {
      const existing = data.find(item => item.id === id)
      const currentTags = existing?.tags || ''
      const tagList = currentTags.split(',').map(t => t.trim()).filter(Boolean)
      if (!tagList.includes(tagInput.trim())) {
        tagList.push(tagInput.trim())
      }
      return { id, tags: tagList.join(', ') }
    })

    const res = await fetch('http://127.0.0.1:8000/api/efp/bulk-update/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (res.ok) {
      alert('Tags updated successfully!')
      setTagInput('')
      setData(prev => prev.map(item =>
        selectedIds.includes(item.id)
          ? { ...item, tags: updates.find(u => u.id === item.id)?.tags || item.tags }
          : item
      ))
    } else {
      alert('Failed to update tags.')
    }
  }

  const exportToCSV = () => {
    const csv = [allFields.join(',')]
    data.forEach(item => {
      const row = allFields.map(field => {
        const val = item[field as keyof EfpItem]
        return `"${(val ?? '').toString().replace(/"/g, '""')}"`
      })
      csv.push(row.join(','))
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'efp_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFilter = () => {
    window.location.reload()
  }

  if (loading) return <p className="text-gray-700">Loading...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="bg-white rounded shadow text-sm">
      <div className="flex justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded">
            Export CSV
          </button>
          <button onClick={clearFilter} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded">
            Clear Filter
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Enter tag"
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={handleUpdateTags}
            disabled={selectedIds.length === 0 || !tagInput.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded disabled:opacity-50"
          >
            Add Tag
          </button>
          <button onClick={selectAll} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Select All</button>
          <button onClick={deselectAll} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded">Deselect All</button>
          <button
            onClick={confirmAndDelete}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded text-white font-medium ${selectedIds.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-[1000px] table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 border-r">Select</th>
              {allFields.map(field => (
                <th key={field} className="px-4 py-2 font-medium text-gray-700 border-r">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id || idx} className="border-t even:bg-gray-50">
                <td className="px-4 py-2 border-r text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                {allFields.map(field => (
                  <td key={field} className="px-4 py-2 border-r whitespace-nowrap text-gray-800">
                    {item[field as keyof EfpItem] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
