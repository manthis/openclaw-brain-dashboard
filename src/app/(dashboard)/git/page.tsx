"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, GitCommit, Upload, Download, RefreshCw, FileCode, Plus, Minus, File } from "lucide-react"
import { toast } from "sonner"

interface GitStatus { status: string; file: string }
interface Commit { hash: string; short: string; message: string; author: string; date: string }

export default function GitPage() {
  const [status, setStatus] = useState<GitStatus[]>([])
  const [branch, setBranch] = useState("")
  const [commits, setCommits] = useState<Commit[]>([])
  const [branches, setBranches] = useState<string[]>([])
  const [diff, setDiff] = useState({ stat: "", diff: "" })
  const [commitMsg, setCommitMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [statusRes, logRes, branchRes, diffRes] = await Promise.all([
        fetch("/api/git?action=status").then((r) => r.json()),
        fetch("/api/git?action=log").then((r) => r.json()),
        fetch("/api/git?action=branches").then((r) => r.json()),
        fetch("/api/git?action=diff").then((r) => r.json()),
      ])
      setStatus(statusRes.status || [])
      setBranch(statusRes.branch || "")
      setCommits(logRes.commits || [])
      setBranches(branchRes.branches || [])
      setDiff(diffRes)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const doCommit = async () => {
    if (!commitMsg) return toast.error("Enter a commit message")
    const res = await fetch("/api/git", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "commit", message: commitMsg }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Committed!")
      setCommitMsg("")
      load()
    } else {
      toast.error(data.error || "Commit failed")
    }
  }

  const doPush = async () => {
    const res = await fetch("/api/git", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "push" }),
    })
    const data = await res.json()
    data.success ? toast.success("Pushed!") : toast.error(data.error || "Push failed")
  }

  const doPull = async () => {
    const res = await fetch("/api/git", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pull" }),
    })
    const data = await res.json()
    data.success ? toast.success("Pulled!") : toast.error(data.error || "Pull failed")
  }

  const statusIcon = (s: string) => {
    if (s === "M" || s === "MM") return <FileCode className="size-3.5 text-[#FFB400]" />
    if (s === "A" || s === "??") return <Plus className="size-3.5 text-[#00A699]" />
    if (s === "D") return <Minus className="size-3.5 text-[#FF385C]" />
    return <File className="size-3.5 text-[#717171]" />
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Git Integration</h2>
          <p className="text-[#717171]">Repository status, commits, and operations.</p>
        </FadeIn>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" onClick={doPull}><Download className="size-4 mr-2" /> Pull</Button>
          <Button onClick={doPush}><Upload className="size-4 mr-2" /> Push</Button>
        </div>
      </div>

      {/* Branch + Commit */}
      <FadeIn delay={0.1}>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <GitBranch className="size-5 text-[#FF385C]" />
              <Badge variant="outline" className="text-sm">{branch || "—"}</Badge>
              <div className="flex gap-1 ml-auto flex-wrap">
                {branches.slice(0, 5).map((b) => (
                  <Badge key={b} variant={b === branch ? "default" : "secondary"} className="text-[10px]">{b}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Commit message..."
                onKeyDown={(e) => e.key === "Enter" && doCommit()}
                className="flex-1"
              />
              <Button onClick={doCommit} disabled={!commitMsg}>
                <GitCommit className="size-4 mr-2" /> Commit All
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status ({status.length})</TabsTrigger>
          <TabsTrigger value="log">Commits</TabsTrigger>
          <TabsTrigger value="diff">Diff</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <FadeIn>
            <Card>
              <CardContent className="pt-6">
                {status.length > 0 ? (
                  <div className="space-y-1">
                    {status.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]">
                        {statusIcon(s.status)}
                        <Badge variant="outline" className="text-[10px] font-mono w-8 justify-center">{s.status}</Badge>
                        <span className="text-sm font-mono">{s.file}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#717171] text-sm text-center py-4">Working tree clean ✨</p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="log">
          <FadeIn>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commits.map((c) => (
                      <TableRow key={c.hash}>
                        <TableCell className="font-mono text-xs text-[#FF385C]">{c.short}</TableCell>
                        <TableCell className="text-sm">{c.message}</TableCell>
                        <TableCell className="text-xs text-[#717171]">{c.author}</TableCell>
                        <TableCell className="text-xs text-[#717171]">{c.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="diff">
          <FadeIn>
            <Card>
              <CardContent className="pt-6">
                {diff.stat ? (
                  <div>
                    <pre className="text-sm font-mono bg-[#F7F7F7] dark:bg-[#1A1A1A] p-4 rounded-xl mb-4 whitespace-pre-wrap">{diff.stat}</pre>
                    <pre className="text-xs font-mono bg-[#F7F7F7] dark:bg-[#1A1A1A] p-4 rounded-xl whitespace-pre-wrap max-h-[500px] overflow-auto">{diff.diff}</pre>
                  </div>
                ) : (
                  <p className="text-[#717171] text-sm text-center py-4">No unstaged changes.</p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>
      </Tabs>
    </PageTransition>
  )
}
