'use client';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ProcessPage() {
  
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


return (
    <div className="p-6 max-w-screen-xl mx-auto text-sm text-gray-900 bg-white">
      {/* Render DropdownMenuDemo at top of the page */}
      <MailchimpDropdownMenu/>

      

         
    </div>
  );
}