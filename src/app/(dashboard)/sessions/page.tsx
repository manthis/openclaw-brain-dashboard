"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, RefreshCw, XCircle, Zap } from "lucide-react"
import { toast } from "sonner"

interface Session {
  id?: string
  sessionId?: string
  label?: string
  model?: string
  channel?: string
  status?: string
  tokens?: number
  created?: string
  [key: string]: unknown
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [raw, setRaw] = useState("")
  const [loading, setLoading] = useState(false)

  const loadSessions = () => {
    setLoading(true)
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => { setSessions(d.sessions || []); setRaw(d.raw || "") })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSessions()
    const interval = setInterval(loadSessions, 15000)
    return () => clearInterval(interval)
  }, [])

  const killSession = async (id: string) => {
    if (!confirm(`Kill session "${id}"?`)) return
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "kill", sessionId: id }),
    })
    toast.success("Session killed")
    loadSessions()
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Sessions Monitor</h2>
          <p className="text-[#717171]">Track active sessions, sub-agents and token usage.</p>
        </FadeIn>
        <Button variant="outline" onClick={loadSessions} disabled={loading}>
          <RefreshCw className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-[#FF385C]" />
              Active Sessions
              <Badge variant="outline" className="ml-2">{sessions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session, i) => {
                    const id = session.id || session.sessionId || `session-${i}`
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-mono text-xs max-w-[150px] truncate">{id}</TableCell>
                        <TableCell>{session.label || "—"}</TableCell>
                        <TableCell className="text-xs">{session.model || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{session.channel || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={session.status === "active" ? "success" : "secondary"}>
                            {session.status || "active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-xs">
                            <Zap className="size-3 text-[#FFB400]" />
                            {session.tokens?.toLocaleString() || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => killSession(id)}>
                            <XCircle className="size-4 text-[#FF385C]" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : raw ? (
              <pre className="text-sm font-mono bg-[#F7F7F7] dark:bg-[#1A1A1A] p-4 rounded-xl whitespace-pre-wrap">{raw}</pre>
            ) : (
              <p className="text-[#717171] text-sm text-center py-8">No active sessions.</p>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  )
}
