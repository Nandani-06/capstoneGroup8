'use client'

import FileImportTable from '@/components/FileImportTable'

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
  "tags"]

export default function ProcessPage() {
  const handleSubmit = (data: any[]) => {
    console.log('Submitted Data:', data)
    // Handle the submitted data here
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <FileImportTable availableFields={availableFields} onSubmit={handleSubmit} />
    </div>
  )
}
