'use client'


import { useState, useEffect } from 'react'

// Filter
import EfpSearchFilterBar from '@/components/EfpSearchFilterBar'
import EfpPreviewTable from '@/components/EfpPreviewTable'

// Template
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


export default function PreviewPage() {


  // Templates
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);


  // Hook to sync templates with front-end on load
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/mailchimp/templateHandler");
        const text = await response.text();
        const data = JSON.parse(text);
        const userTemplates = data.templates?.filter(template => template.type === "user") || [];

        setTemplates(userTemplates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Select template and fetch createCampaign API route
  const selectTemplate = async (templateId, templateName) => {
    try {
      const response = await fetch("/api/mailchimp/campaignHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, templateName }),
      });

      const data = await response.json();
      setSubmissionCount(prevCount => prevCount + 1); // Show message after successful submission
      console.log("Campaign response:", data);

    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };

  // Use a shadcn dropdown menu to generate template list
  const MailchimpDropdownMenu = ({ onSelect }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"> {loading ? "Loading..." : selectedTemplate ? selectedTemplate.name : "Select a Template"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-55">
        <DropdownMenuLabel>Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.length > 0 ? (
          templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => onSelect(template)}
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

  const [emailsToExport, setEmailsToExport] = useState<string[]>([])

  const copyEmailsToClipboard = () => {
    const bccString = emailsToExport.join('; ')
    navigator.clipboard.writeText(bccString).then(() => {
      alert('Emails copied to clipboard (BCC format)!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  }


  const [filter, setFilter] = useState<Record<string, string>>({})

  return (
    <div>
      <div>
        <EfpSearchFilterBar filter={filter} onFilterChange={setFilter} />
        <EfpPreviewTable filter={filter} onExportEmails={setEmailsToExport} />

      </div>
      <div>
        <p>Select a template you would like to receive via email:</p>
        <div className="mx-auto text-sm font-medium py-2 rounded flex flex-wrap gap-2 items-center">
          <MailchimpDropdownMenu onSelect={setSelectedTemplate} />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
            disabled={!selectedTemplate}
            onClick={() => selectTemplate(selectedTemplate.id, selectedTemplate.name)}
          >
            Submit
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded"
            disabled={emailsToExport.length === 0}
            onClick={copyEmailsToClipboard}
          >
            📋 Copy Emails (BCC)
          </Button>
        </div>

      </div>


    </div>
  );
}
