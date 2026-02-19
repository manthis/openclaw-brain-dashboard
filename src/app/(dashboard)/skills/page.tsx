"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Puzzle, Plus, Trash2, FolderOpen, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface Skill {
  name: string
  source: string
  path: string
  description: string
  hasConfig: boolean
  files: string[]
}

interface SkillDetail {
  name: string
  path: string
  files: Record<string, string>
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selected, setSelected] = useState<SkillDetail | null>(null)
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [editContent, setEditContent] = useState("")
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const loadSkills = () => {
    fetch("/api/skills").then((r) => r.json()).then((d) => setSkills(d.skills || []))
  }

  useEffect(() => { loadSkills() }, [])

  const viewSkill = async (name: string) => {
    const res = await fetch(`/api/skills/${name}`)
    const data = await res.json()
    setSelected(data)
    const firstFile = Object.keys(data.files)[0]
    if (firstFile) {
      setSelectedFile(firstFile)
      setEditContent(data.files[firstFile])
    }
  }

  const saveFile = async () => {
    if (!selected) return
    await fetch(`/api/skills/${selected.name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: selectedFile, content: editContent }),
    })
    toast.success("File saved")
  }

  const createSkill = async () => {
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    })
    setNewName("")
    setNewDesc("")
    setDialogOpen(false)
    loadSkills()
    toast.success("Skill created")
  }

  const deleteSkill = async (skill: Skill) => {
    if (skill.source !== "local") return toast.error("Cannot delete global skills")
    if (!confirm(`Delete skill "${skill.name}"?`)) return
    await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: skill.path }),
    })
    loadSkills()
    if (selected?.name === skill.name) setSelected(null)
    toast.success("Skill deleted")
  }

  // Pagination
  const totalPages = Math.ceil(skills.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSkills = skills.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Skills Manager</h2>
          <p className="text-[#717171]">Manage OpenClaw skills and configurations.</p>
        </FadeIn>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" /> New Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Skill</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="my-skill" /></div>
              <div><Label>Description</Label><Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What does this skill do?" /></div>
              <Button onClick={createSkill} disabled={!newName} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills List */}
        <div className="flex flex-col h-full">
          <div className="space-y-3 flex-1">
            {paginatedSkills.map((skill) => (
              <FadeIn key={skill.name + skill.source}>
                <Card
                  className={`cursor-pointer transition-shadow hover:shadow-md ${selected?.name === skill.name ? "ring-2 ring-[#FF385C]" : ""}`}
                  onClick={() => viewSkill(skill.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Puzzle className="size-4 text-[#FF385C]" />
                        <CardTitle className="text-sm">{skill.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={skill.source === "global" ? "secondary" : "outline"} className="text-[10px]">
                          {skill.source}
                        </Badge>
                        {skill.source === "local" && (
                          <Button variant="ghost" size="icon" className="size-7" onClick={(e) => { e.stopPropagation(); deleteSkill(skill) }}>
                            <Trash2 className="size-3 text-[#FF385C]" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {skill.description && <p className="text-xs text-[#717171] mt-1">{skill.description}</p>}
                    <div className="flex gap-1 mt-2">
                      {skill.hasConfig && <Badge variant="outline" className="text-[10px]"><Settings className="size-2.5 mr-1" />config</Badge>}
                      <Badge variant="outline" className="text-[10px]"><FileText className="size-2.5 mr-1" />{skill.files.length} files</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
            {skills.length === 0 && <p className="text-[#717171] text-sm">No skills found.</p>}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-[#717171]">
                Showing {startIndex + 1}-{Math.min(endIndex, skills.length)} of {skills.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Skill Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="size-5 text-[#FF385C]" />
                    {selected.name}
                  </CardTitle>
                  <Button size="sm" onClick={saveFile}>Save</Button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {Object.keys(selected.files).map((f) => (
                    <Button
                      key={f}
                      variant={selectedFile === f ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setSelectedFile(f); setEditContent(selected.files[f]) }}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="font-mono text-sm min-h-[400px]"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-[#717171]">
                Select a skill to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
