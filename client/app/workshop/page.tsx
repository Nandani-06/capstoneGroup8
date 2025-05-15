'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Workshop {
  id: number
  date: string
  event: string
  event_type: string
  presenters: string
  participants: number
  participants_female: number
  schools: number
  project: string
  comment: string
}

export default function WorkshopPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState<Workshop | null>(null)
  const [form, setForm] = useState<Partial<Workshop>>({})
  const [date, setDate] = useState<Date | undefined>()

  const PAGE_SIZE = 15
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/workshops/')
      .then(res => res.json())
      .then(data => {
        setWorkshops(data)
        setLoading(false)
      })
  }, [])

  const paginated = workshops.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleEdit = (workshop: Workshop) => {
    setSelected(workshop)
    setForm(workshop)
    setDate(workshop.date ? new Date(workshop.date) : undefined)
    setShowDialog(true)
  }

  const handleDelete = async (workshop: Workshop) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${workshop.event}"?`)
    if (!confirmed) return

    await fetch(`http://127.0.0.1:8000/api/workshops/${workshop.id}/delete/`, { method: 'DELETE' })
    setWorkshops(prev => prev.filter(w => w.id !== workshop.id))
  }


  const handleSubmit = async () => {
    const method = selected ? 'PUT' : 'POST'
    const url = selected
      ? `http://127.0.0.1:8000/api/workshops/${selected.id}/update/`
      : 'http://127.0.0.1:8000/api/workshops/create/'

    const payload = {
      ...form,
      date: date ? format(date, 'yyyy-MM-dd') : null,
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (selected) {
      setWorkshops(prev => prev.map(w => (w.id === selected.id ? data : w)))
    } else {
      setWorkshops(prev => [...prev, data])
    }
    setShowDialog(false)
    setSelected(null)
    setForm({})
    setDate(undefined)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Workshops</h1>
        <Button onClick={() => { setSelected(null); setForm({}); setDate(undefined); setShowDialog(true) }}>
          + Add Workshop
        </Button>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-center">Date</th>
            <th className="border px-3 py-2 text-center">Event</th>
            <th className="border px-3 py-2 text-center">Event Type</th>
            <th className="border px-3 py-2 text-center">Presenters</th>
            <th className="border px-3 py-2 text-center">Participants</th>
            <th className="border px-3 py-2 text-center">Female</th>
            <th className="border px-3 py-2 text-center">Schools</th>
            <th className="border px-3 py-2 text-center">Project</th>
            <th className="border px-3 py-2 text-center">Comment</th>
            <th className="border px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
  {paginated.map(w => (
    <tr key={w.id} className="border">
      <td className="px-3 py-2 text-center">{w.date}</td>
      <td className="px-3 py-2 text-center">{w.event}</td>
      <td className="px-3 py-2 text-center">{w.event_type}</td>
      <td className="px-3 py-2 text-center">{w.presenters}</td>
      <td className="px-3 py-2 text-center">{w.participants}</td>
      <td className="px-3 py-2 text-center">{w.participants_female}</td>
      <td className="px-3 py-2 text-center">{w.schools}</td>
      <td className="px-3 py-2 text-center">{w.project}</td>
      <td className="px-3 py-2 text-center">{w.comment}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        <Button size="sm" onClick={() => handleEdit(w)} className="mr-2">Edit</Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(w)}>Delete</Button>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= workshops.length}>Next</Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Workshop' : 'Add Workshop'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}> {date ? format(date, "PPP") : "Pick a date"} </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Input placeholder="Event" value={form.event || ''} onChange={e => setForm({ ...form, event: e.target.value })} />
            <Input placeholder="Event Type" value={form.event_type || ''} onChange={e => setForm({ ...form, event_type: e.target.value })} />
            <Textarea placeholder="Presenters" value={form.presenters || ''} onChange={e => setForm({ ...form, presenters: e.target.value })} />
            <Input placeholder="Participants" type="number" value={form.participants ?? ''} onChange={e => setForm({ ...form, participants: Number(e.target.value) })} />
            <Input placeholder="Female Participants" type="number" value={form.participants_female ?? ''} onChange={e => setForm({ ...form, participants_female: Number(e.target.value) })} />
            <Input placeholder="Schools" type="number" value={form.schools ?? ''} onChange={e => setForm({ ...form, schools: Number(e.target.value) })} />
            <Textarea placeholder="Project" value={form.project || ''} onChange={e => setForm({ ...form, project: e.target.value })} />
            <Textarea placeholder="Comment" value={form.comment || ''} onChange={e => setForm({ ...form, comment: e.target.value })} />
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
