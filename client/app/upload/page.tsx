// app/upload/page.tsx
'use client'

import FileImportTable from '@/components/FileImportTable'
import AddContact from '@/app/components/AddContact'
import EditContact from '@/app/components/EditContact'

const availableFields = [
  "first_name",
  "last_name",
  "sex",
  "email",
  "email_2",
  "phone",
  "mobile",
  "teacher_category",
  "school_name",
  "school_category",
  "industry",
  "file_name",
  "sheet_name",
  "tags"
]

export default function UploadPage() {
  const handleSubmit = (data: any[]) => {
    console.log('Submitted Data:', data)
  }

  return (
    <div className="mx-auto py-10 px-4">
      <section className="bg-white rounded-lg shadow-lg overflow-hidden ">
        <header className="bg-gray-100 px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Data Upload</h1>
          <p className="mt-1 text-sm text-gray-600">Select fields and submit</p>
        </header>
        <div className="p-6 space-y-6">
          <FileImportTable
            availableFields={availableFields}
            onSubmit={handleSubmit}
          />
        </div>
        <footer className="px-6 py-4 bg-gray-50 border-t text-right">
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </footer>
      </section>
      <div className="mt-10">
        <AddContact />
        <EditContact />
      </div>
    </div>
  )
}
