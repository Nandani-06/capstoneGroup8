'use client';

import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const availableFields = ['name', 'email', 'age', 'phone'];

// ProcessPage main component
'use client'

export default function ProcessPage() {
  
  // Drag and Drop
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[][]>([]);
  const [fieldMap, setFieldMap] = useState<{ [key: string]: string }>({});

  // Templates
  const [templates, setTemplates] = useState([]); // State for storing template data
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Hook to sync templates with front-end on load
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch response from back-end
        const response = await fetch("/api/mailchimp/templates");
        const text = await response.text();
        console.log("Raw response:", text);

        // Logging console variables to debug
        console.log("server:" , process.env.MAILCHIMP_SERVER_PREFIX)
        console.log("list_id:", process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID);
  
        // Parse response as JSON
        const data = JSON.parse(text);

        // Filter templates created by users only
        const userTemplates = data.templates?.filter(template => template.type === "user") || [];
  
        // Set templates to data
        setTemplates(userTemplates); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setLoading(false);
      }
    };
  
    // Call function
    fetchTemplates();
  }, []);

  
  // Select template and fetch createCampaign API route
  const selectTemplate = async (templateId, templateName) => {
    try {
      const response = await fetch("/api/mailchimp/createCampaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId, // Selected template ID
          templateName, // For subject line
          
        }),
      });
  
      const data = await response.json();
      console.log("Campaign response:", data);
      
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };

  
  // Use a shadcn dropdown menu to generate template list
  const MailchimpDropdownMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{loading ? "Loading..." : "Select a Template"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.length > 0 ? (
          templates.map((template) => (
            <DropdownMenuItem 
            key={template.id}
            onClick={() => selectTemplate(template.id, template.name)}
            >
            {template.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No templates found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const reader = new FileReader();
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        const headers = data[0] || [];
        const content = data.slice(1);
        setRawHeaders(headers);
        setRawData(content);
        setFieldMap({});
      };
      reader.readAsBinaryString(acceptedFiles[0]);
    },
  });



  const mappedData = useMemo(() => {
    return rawData.map((row) => {
      const mappedRow: any = {};
      rawHeaders.forEach((header, i) => {
        const mappedField = fieldMap[header];
        if (mappedField) {
          mappedRow[mappedField] = row[i];
        }
      });
      return mappedRow;
    });
  }, [rawData, rawHeaders, fieldMap]);
  

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      Object.keys(mappedData[0] || {}).map((field) => ({
        accessorKey: field,
        header: field,
        cell: (info) => (
          <input
            className="border border-gray-300 bg-white text-gray-900 px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={info.getValue() ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              const rowIndex = info.row.index;
              mappedData[rowIndex][field] = newValue;
              setRawData([...rawData]);
            }}
          />
        ),
      })),
    [mappedData, rawData]
  );

  const table = useReactTable({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const handleFieldChange = (header: string, selected: string) => {
    setFieldMap((prev) => ({ ...prev, [header]: selected }));
  };

  const handleSubmit = () => {
    console.log('Submit Data', mappedData);
  };

  return (
    <div className="max-w-screen-md mx-auto text-center py-24 px-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Einstein First & Quantum girls Database</h1>
      <p className="text-gray-600 mb-6">
        This system allows you to upload, preview, and manage data of the Einstein First and Quantum girls.
      </p>
      <p className="text-gray-500">
        Use the sidebar to navigate to the <strong>Data Upload</strong> and <strong>Data Preview</strong> sections.
      </p>
    </div>
  );
}
