'use client';

import { useEffect, useState } from 'react';
import Header from '../components/header';
import Filter from '../components/filter';

export default function ProcessPage() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]); // Dynamic columns
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ time: string; attribute: string }>({
    time: 'today',
    attribute: 'default',
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/efp-database/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // Set data and dynamically extract columns
        setData(result.data);
        if (result.data.length > 0) {
          setColumns(Object.keys(result.data[0])); // Extract column names from the first record
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Re-fetch data when filters change

  const handleFilterChange = (newFilters: { time: string; attribute: string }) => {
    setFilters(newFilters);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-sm text-gray-900 bg-white">
      <Header />

      {/* Filter Component */}
      <div className="mt-4 mb-6 ml-8">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th key={column} className="border border-gray-300 px-4 py-2">
                  {column.replace(/_/g, ' ').toUpperCase()} {/* Format column names */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr
                key={record.id || index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {columns.map((column) => (
                  <td key={column} className="border border-gray-300 px-4 py-2">
                    {record[column] ?? '-'} {/* Display data or placeholder */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}