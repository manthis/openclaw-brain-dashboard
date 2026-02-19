"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, Brain, Cpu, HardDrive, GitBranch, Clock, FileEdit, Puzzle, Settings } from "lucide-react"
import Link from "next/link"

interface Metrics {
  cpu: { usage: number; cores: number }
  memory: { percent: number; total: number; used: number }
  disk: { percent: number }
  gateway: string
  hostname: string
}

const quickActions = [
  { href: "/editor", label: "Edit Files", icon: FileEdit, color: "#FF385C" },
  { href: "/skills", label: "Skills", icon: Puzzle, color: "#00A699" },
  { href: "/crons", label: "Cron Jobs", icon: Clock, color: "#FFB400" },
  { href: "/config", label: "Config", icon: Settings, color: "#717171" },
  { href: "/git", label: "Git", icon: GitBranch, color: "#222222" },
]

function formatBytes(bytes: number) {
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb.toFixed(1)} GB`
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [sessions, setSessions] = useState<{ sessions: unknown[]; raw?: string }>({ sessions: [] })

  useEffect(() => {
    fetch("/api/monitoring").then((r) => r.json()).then(setMetrics).catch(() => {})
    fetch("/api/sessions").then((r) => r.json()).then(setSessions).catch(() => {})
    const interval = setInterval(() => {
      fetch("/api/monitoring").then((r) => r.json()).then(setMetrics).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageTransition>
      <FadeIn delay={0.05}>
        <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7] mb-1">Dashboard</h2>
        <p className="text-[#717171] mb-8">Monitor and manage your OpenClaw Brain instance.</p>
      </FadeIn>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#FF385C]/10 text-[#FF385C]">
                  <Activity className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <CardDescription>Gateway</CardDescription>
                  <CardTitle className="text-lg">
                    <Badge variant={metrics?.gateway === "running" ? "success" : "destructive"}>
                      {metrics?.gateway || "Loading..."}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#00A699]/10 text-[#00A699]">
                  <Zap className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <CardDescription>Sessions</CardDescription>
                  <CardTitle className="text-lg">{sessions.sessions?.length || 0} active</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#FFB400]/10 text-[#FFB400]">
                  <Cpu className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <CardDescription>CPU</CardDescription>
                  <CardTitle className="text-lg">{metrics?.cpu.usage ?? "—"}%</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#717171]/10 text-[#717171]">
                  <HardDrive className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <CardDescription>Memory</CardDescription>
                  <CardTitle className="text-lg">
                    {metrics ? `${metrics.memory.percent}%` : "—"}
                    {metrics && <span className="text-xs text-[#717171] ml-1">/ {formatBytes(metrics.memory.total)}</span>}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </FadeIn>
      </div>

      {/* Quick Actions */}
      <FadeIn delay={0.3}>
        <h3 className="text-lg font-bold text-[#222222] dark:text-[#F7F7F7] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
                  <div className="flex items-center justify-center size-10 rounded-xl" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                    <action.icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-medium text-[#222222] dark:text-[#F7F7F7]">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* System Info */}
      <FadeIn delay={0.35}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="size-5 text-[#FF385C]" strokeWidth={1.75} />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[#717171]">Hostname</p>
                <p className="font-medium text-[#222222] dark:text-[#F7F7F7]">{metrics?.hostname || "—"}</p>
              </div>
              <div>
                <p className="text-[#717171]">CPU Cores</p>
                <p className="font-medium text-[#222222] dark:text-[#F7F7F7]">{metrics?.cpu.cores || "—"}</p>
              </div>
              <div>
                <p className="text-[#717171]">Disk Usage</p>
                <p className="font-medium text-[#222222] dark:text-[#F7F7F7]">{metrics?.disk.percent ?? "—"}%</p>
              </div>
              <div>
                <p className="text-[#717171]">RAM Used</p>
                <p className="font-medium text-[#222222] dark:text-[#F7F7F7]">{metrics ? formatBytes(metrics.memory.used) : "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  )
}
