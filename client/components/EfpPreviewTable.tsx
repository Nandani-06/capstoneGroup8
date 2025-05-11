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
        setCurrentPage(1)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [filter])

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
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={clearFilter}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
        >
          Clear Filter
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-[1000px] table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
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
