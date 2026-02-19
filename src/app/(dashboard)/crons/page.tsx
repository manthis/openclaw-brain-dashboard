"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Plus, Play, Trash2, PauseCircle } from "lucide-react"
import { toast } from "sonner"

interface Cron {
  name?: string
  schedule?: string
  status?: string
  lastRun?: string
  nextRun?: string
  task?: string
  [key: string]: unknown
}

export default function CronsPage() {
  const [crons, setCrons] = useState<Cron[]>([])
  const [raw, setRaw] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: "", schedule: "", task: "", model: "" })

  const loadCrons = () => {
    fetch("/api/crons").then((r) => r.json()).then((d) => {
      setCrons(d.crons || [])
      setRaw(d.raw || "")
    })
  }

  useEffect(() => { loadCrons() }, [])

  const createCron = async () => {
    await fetch("/api/crons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...form }),
    })
    setDialogOpen(false)
    setForm({ name: "", schedule: "", task: "", model: "" })
    loadCrons()
    toast.success("Cron created")
  }

  const runCron = async (name: string) => {
    await fetch("/api/crons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "run", name }),
    })
    toast.success("Cron triggered")
  }

  const deleteCron = async (name: string) => {
    if (!confirm(`Delete cron "${name}"?`)) return
    await fetch("/api/crons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", name }),
    })
    loadCrons()
    toast.success("Cron deleted")
  }

  const toggleCron = async (name: string) => {
    await fetch("/api/crons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", name }),
    })
    loadCrons()
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Cron Jobs</h2>
          <p className="text-[#717171]">Schedule and manage recurring tasks.</p>
        </FadeIn>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" /> New Cron</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Cron Job</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="my-cron" /></div>
              <div><Label>Schedule</Label><Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="*/30 * * * *" /></div>
              <div><Label>Task</Label><Input value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} placeholder="Check emails" /></div>
              <div><Label>Model (optional)</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="anthropic/claude-sonnet-4-5" /></div>
              <Button onClick={createCron} disabled={!form.schedule || !form.task} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-[#FF385C]" />
              Scheduled Jobs
              <Badge variant="outline" className="ml-2">{crons.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {crons.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crons.map((cron, i) => (
                    <TableRow key={cron.name || i}>
                      <TableCell className="font-medium">{cron.name || `cron-${i}`}</TableCell>
                      <TableCell className="font-mono text-xs">{cron.schedule || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={cron.status === "active" || cron.status === "enabled" ? "success" : "secondary"}>
                          {cron.status || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#717171] max-w-xs truncate">{cron.task || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => runCron(cron.name || `${i}`)}>
                            <Play className="size-3.5 text-[#00A699]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => toggleCron(cron.name || `${i}`)}>
                            <PauseCircle className="size-3.5 text-[#FFB400]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => deleteCron(cron.name || `${i}`)}>
                            <Trash2 className="size-3.5 text-[#FF385C]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : raw ? (
              <pre className="text-sm font-mono bg-[#F7F7F7] dark:bg-[#1A1A1A] p-4 rounded-xl whitespace-pre-wrap">{raw}</pre>
            ) : (
              <p className="text-[#717171] text-sm text-center py-8">No cron jobs configured. Create one to get started.</p>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  )
}
