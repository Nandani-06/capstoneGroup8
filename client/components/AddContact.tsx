"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AddContact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    first_name: "",
    last_name: "",
    sex: "",
    email: "",
    email_2: "",
    teacher_category: "",
    tags: "",
    phone: "",
    mobile: "",
    school_name: "",
    school_category: "",
    industry: "",
    file_name: "",
    sheet_name: "",
  });

  const resetContactInfo = () => ({
    first_name: "",
    last_name: "",
    sex: "",
    email: "",
    email_2: "",
    teacher_category: "",
    tags: "",
    phone: "",
    mobile: "",
    school_name: "",
    school_category: "",
    industry: "",
    file_name: "",
    sheet_name: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/efp/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setContactInfo(resetContactInfo());
      } else {
        const errorData = await response.json();
        console.error("Failed to add contact", errorData);
      }
    } catch (error) {
      console.error("Error adding contact", error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Add Contact</Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="space-y-4"
          >
            <Input type="text" name="first_name" value={contactInfo.first_name} onChange={handleInputChange} placeholder="First Name" />
            <Input type="text" name="last_name" value={contactInfo.last_name} onChange={handleInputChange} placeholder="Last Name" />
            <Input type="text" name="sex" value={contactInfo.sex} onChange={handleInputChange} placeholder="Sex" />
            <Input type="email" name="email" value={contactInfo.email} onChange={handleInputChange} placeholder="Email" />
            <Input type="email" name="email_2" value={contactInfo.email_2} onChange={handleInputChange} placeholder="Alternate Email" />
            <Input type="text" name="teacher_category" value={contactInfo.teacher_category} onChange={handleInputChange} placeholder="Teacher Category" />
            <Textarea name="tags" value={contactInfo.tags} onChange={handleInputChange} placeholder="Tags" />
            <Input type="text" name="phone" value={contactInfo.phone} onChange={handleInputChange} placeholder="Phone" />
            <Input type="text" name="mobile" value={contactInfo.mobile} onChange={handleInputChange} placeholder="Mobile" />
            <Input type="text" name="school_name" value={contactInfo.school_name} onChange={handleInputChange} placeholder="School Name" />
            <Input type="text" name="school_category" value={contactInfo.school_category} onChange={handleInputChange} placeholder="School Category" />
            <Input type="text" name="industry" value={contactInfo.industry} onChange={handleInputChange} placeholder="Industry" />
            <Input type="text" name="file_name" value={contactInfo.file_name} onChange={handleInputChange} placeholder="File Name" />
            <Input type="text" name="sheet_name" value={contactInfo.sheet_name} onChange={handleInputChange} placeholder="Sheet Name" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}