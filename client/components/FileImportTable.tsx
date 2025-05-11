'use client'

import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { useState, useMemo, useRef } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'


interface FileImportTableProps {
  availableFields: string[]
  onSubmit: (data: any[]) => void
}



export default function FileImportTable({
  availableFields,
  onSubmit,
}: FileImportTableProps) {
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawData, setRawData] = useState<any[][]>([])
  const [fieldMap, setFieldMap] = useState<{ [key: string]: string }>({})
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
//record file name

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      setUploadedFileName(file.name)
    
      const reader = new FileReader()
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]
        const headers = data[0] || []
        const content = data.slice(1)
        setRawHeaders(headers)
        setRawData(content)
        setFieldMap({})
      }
      reader.readAsBinaryString(file)
    },
  })

  const mappedData = useMemo(() => {
    return rawData.map((row, rowIndex) => {
      const mappedRow: any = {}
      rawHeaders.forEach((header, i) => {
        const mappedField = fieldMap[header]
        if (mappedField) {
          mappedRow[mappedField] = row[i]
        }
      })
  
      if (uploadedFileName) {
        mappedRow.file_name = uploadedFileName
      }
  
      return mappedRow
    })
  }, [rawData, rawHeaders, fieldMap, uploadedFileName])
  

  const columns = useMemo<ColumnDef<any>[]>(() =>
    Object.keys(mappedData[0] || {}).map(field => ({
      accessorKey: field,
      header: field,
      cell: info => (
        <input
          className="border border-gray-300 bg-white text-gray-900 px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={info.getValue() ?? ''}
          onChange={e => {
            const newValue = e.target.value
            const rowIndex = info.row.index
            mappedData[rowIndex][field] = newValue
            setRawData([...rawData])
          }}
        />
      ),
    })), [mappedData, rawData]
  )

  const table = useReactTable({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  const handleFieldChange = (header: string, selected: string) => {
    setFieldMap(prev => ({ ...prev, [header]: selected }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/efp/bulk/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedData),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Submission failed:', errorData)
        alert('Submission failed. Please check your data.')
      } else {
        const result = await response.json()
        console.log('Submission successful:', result)
        alert('Data submitted successfully!')
      }
    } catch (err) {
      console.error('Network or server error:', err)
      alert('An error occurred. Please try again later.')
    }
  }
  

  return (
    <div className="p-6 text-sm text-gray-900 bg-white">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-8 rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-700 font-medium">
          📁 Drag & drop your Excel/CSV file here or click to select
        </p>
      </div>

      {rawHeaders.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Column Mapping</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {rawHeaders.map((header, index) => (
              <div key={header || `header-${index}`}>
                <label className="block mb-1 font-medium text-gray-800">
                  {header || `(empty header ${index + 1})`}
                </label>
                <select
                  value={fieldMap[header] || ''}
                  onChange={e => handleFieldChange(header, e.target.value)}
                  className="border border-gray-300 bg-white text-gray-900 px-3 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ignore this column</option>
                  {availableFields.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {mappedData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Data Preview (Virtual Scroll)</h2>
          <div
            ref={tableContainerRef}
            className="h-[500px] overflow-auto border rounded-md shadow-sm border-gray-300 bg-white"
          >
            <div className="min-w-[600px]">
              <div className="flex bg-gray-200 sticky top-0 z-10 border-b border-gray-300">
                {table.getHeaderGroups()[0].headers.map(header => (
                  <div
                    key={header.id}
                    className="flex-1 px-4 py-2 font-semibold text-gray-800 border-r border-gray-300"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                ))}
              </div>

              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualRow => {
                  const row = table.getRowModel().rows[virtualRow.index]
                  return (
                    <div
                      key={row.id}
                      className="flex even:bg-gray-100 absolute left-0 right-0"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                        height: `${virtualRow.size}px`,
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <div
                          key={cell.id}
                          className="flex-1 px-4 py-2 border-t border-gray-300 text-gray-900"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Submit Data
          </button>
        </div>
      )}
    </div>
  )
}
