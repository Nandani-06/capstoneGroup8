"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";

export default function AddContactModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(""); // For entering ID before editing
  const [isFetching, setIsFetching] = useState(false); // Loading state for fetching contact
  const [fetchError, setFetchError] = useState(""); // Error state for fetching
  const [contactInfo, setContactInfo] = useState({
    id: "",
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
    id: "",
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
      const url = isEditMode
        ? `http://127.0.0.1:8000/api/efp/update/${contactInfo.id}`
        : "http://127.0.0.1:8000/api/efp/create/";
      const method = isEditMode ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        console.log(isEditMode ? "Contact updated successfully" : "Contact added successfully");
        setIsModalOpen(false);
        setContactInfo(resetContactInfo());
        setEditId("");
        setFetchError("");
      } else {
        const errorData = await response.json();
        console.error(isEditMode ? "Failed to update contact" : "Failed to add contact", errorData);
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating contact" : "Error adding contact", error);
    }
  };

  // Open modal for adding
  const openAddModal = () => {
    setContactInfo(resetContactInfo());
    setIsEditMode(false);
    setIsModalOpen(true);
    setEditId("");
    setFetchError("");
  };

  // Open modal for editing (step 1: ask for ID)
  const openEditModal = () => {
    setContactInfo(resetContactInfo());
    setIsEditMode(true);
    setIsModalOpen(true);
    setEditId("");
    setFetchError("");
  };

  // Fetch contact info by ID (step 2: after entering ID)
  const fetchContactById = async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      // Use your search-efpincol API
      const res = await fetch(`http://127.0.0.1:8000/api/search-efpincol?q=${editId}&col=id`);
      if (!res.ok) {
        setFetchError("Contact not found.");
        setIsFetching(false);
        return;
      }
      const data = await res.json();
      // search-efpincol returns a list, so check if any result
      if (!Array.isArray(data) || data.length === 0) {
        setFetchError("Contact not found.");
        setIsFetching(false);
        return;
      }
      const contact = data[0];
      setContactInfo({
        id: contact.id?.toString() || "",
        first_name: contact.first_name || "",
        last_name: contact.last_name || "",
        sex: contact.sex || "",
        email: contact.email || "",
        email_2: contact.email_2 || "",
        teacher_category: contact.teacher_category || "",
        tags: contact.tags || "",
        phone: contact.phone || "",
        mobile: contact.mobile || "",
        school_name: contact.school_name || "",
        school_category: contact.school_category || "",
        industry: contact.industry || "",
        file_name: contact.file_name || "",
        sheet_name: contact.sheet_name || "",
      });
      setIsFetching(false);
      setFetchError("");
    } catch (err) {
      setFetchError("Failed to fetch contact.");
      setIsFetching(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 mt-6">
        <Button onClick={openAddModal}>Add Contact</Button>
        <Button variant="secondary" onClick={openEditModal}>Edit Contact</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Contact" : "Add Contact"}</DialogTitle>
          </DialogHeader>
          {/* Edit mode: Step 1 - Enter ID */}
          {isEditMode && !contactInfo.id && (
            <div className="space-y-4">
              <Input
                type="text"
                name="editId"
                value={editId}
                onChange={e => setEditId(e.target.value)}
                placeholder="Enter Contact ID"
              />
              <Button
                onClick={fetchContactById}
                disabled={!editId || isFetching}
              >
                {isFetching ? "Fetching..." : "Fetch Contact"}
              </Button>
              {fetchError && <div className="text-red-600 text-sm">{fetchError}</div>}
            </div>
          )}
          {/* Edit mode: Step 2 - Show form if contact loaded, or Add mode */}
          {(!isEditMode || contactInfo.id) && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleFormSubmit();
              }}
              className="space-y-4"
            >
              {isEditMode && (
                <Input
                  type="text"
                  name="id"
                  value={contactInfo.id}
                  onChange={handleInputChange}
                  placeholder="ID"
                  disabled
                />
              )}
              <Input
                type="text"
                name="first_name"
                value={contactInfo.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
              />
              <Input
                type="text"
                name="last_name"
                value={contactInfo.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
              <Input
                type="text"
                name="sex"
                value={contactInfo.sex}
                onChange={handleInputChange}
                placeholder="Sex"
              />
              <Input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <Input
                type="email"
                name="email_2"
                value={contactInfo.email_2}
                onChange={handleInputChange}
                placeholder="Alternate Email"
              />
              <Input
                type="text"
                name="teacher_category"
                value={contactInfo.teacher_category}
                onChange={handleInputChange}
                placeholder="Teacher Category"
              />
              <Textarea
                name="tags"
                value={contactInfo.tags}
                onChange={handleInputChange}
                placeholder="Tags"
              />
              <Input
                type="text"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              <Input
                type="text"
                name="mobile"
                value={contactInfo.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
              />
              <Input
                type="text"
                name="school_name"
                value={contactInfo.school_name}
                onChange={handleInputChange}
                placeholder="School Name"
              />
              <Input
                type="text"
                name="school_category"
                value={contactInfo.school_category}
                onChange={handleInputChange}
                placeholder="School Category"
              />
              <Input
                type="text"
                name="industry"
                value={contactInfo.industry}
                onChange={handleInputChange}
                placeholder="Industry"
              />
              <Input
                type="text"
                name="file_name"
                value={contactInfo.file_name}
                onChange={handleInputChange}
                placeholder="File Name"
              />
              <Input
                type="text"
                name="sheet_name"
                value={contactInfo.sheet_name}
                onChange={handleInputChange}
                placeholder="Sheet Name"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">{isEditMode ? "Update" : "Submit"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}