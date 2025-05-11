"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditContactProps {
  open: boolean;
  contact: any;
  onClose: () => void;
  onUpdated: (updated: any) => void;
}

export default function EditContact({ open, contact, onClose, onUpdated }: EditContactProps) {
  const [form, setForm] = useState(contact || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(contact || {});
    setError(null);
  }, [contact, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/efp/update/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(typeof err === "string" ? err : JSON.stringify(err));
        setLoading(false);
        return;
      }
      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="first_name" value={form.first_name ?? ""} onChange={handleChange} placeholder="First Name" />
          <Input name="last_name" value={form.last_name ?? ""} onChange={handleChange} placeholder="Last Name" />
          <Input name="sex" value={form.sex ?? ""} onChange={handleChange} placeholder="Sex" />
          <Input name="email" value={form.email ?? ""} onChange={handleChange} placeholder="Email" />
          <Input name="email_2" value={form.email_2 ?? ""} onChange={handleChange} placeholder="Alternate Email" />
          <Input name="teacher_category" value={form.teacher_category ?? ""} onChange={handleChange} placeholder="Teacher Category" />
          <Textarea name="tags" value={form.tags ?? ""} onChange={handleChange} placeholder="Tags" />
          <Input name="phone" value={form.phone ?? ""} onChange={handleChange} placeholder="Phone" />
          <Input name="mobile" value={form.mobile ?? ""} onChange={handleChange} placeholder="Mobile" />
          <Input name="school_name" value={form.school_name ?? ""} onChange={handleChange} placeholder="School Name" />
          <Input name="school_category" value={form.school_category ?? ""} onChange={handleChange} placeholder="School Category" />
          <Input name="industry" value={form.industry ?? ""} onChange={handleChange} placeholder="Industry" />
          <Input name="file_name" value={form.file_name ?? ""} onChange={handleChange} placeholder="File Name" />
          <Input name="sheet_name" value={form.sheet_name ?? ""} onChange={handleChange} placeholder="Sheet Name" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}