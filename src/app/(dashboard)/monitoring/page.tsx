"use client"

import { useEffect, useState } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, HardDrive, Monitor, Server, RefreshCw } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Metrics {
  cpu: { usage: number; cores: number; model: string }
  memory: { total: number; used: number; free: number; percent: number }
  disk: { total: number; used: number; available: number; percent: number }
  uptime: number
  loadAvg: number[]
  gateway: string
  hostname: string
  platform: string
  arch: string
  timestamp: number
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [history, setHistory] = useState<{ time: string; cpu: number; mem: number }[]>([])

  const loadMetrics = () => {
    fetch("/api/monitoring").then((r) => r.json()).then((data) => {
      setMetrics(data)
      setHistory((prev) => {
        const entry = {
          time: new Date(data.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          cpu: data.cpu.usage,
          mem: data.memory.percent,
        }
        const next = [...prev, entry]
        return next.slice(-30) // Keep last 30 data points
      })
    })
  }

  useEffect(() => {
    loadMetrics()
    const interval = setInterval(loadMetrics, 10000)
    return () => clearInterval(interval)
  }, [])

  const ProgressBar = ({ value, color }: { value: number; color: string }) => (
    <div className="w-full h-2 bg-[#F7F7F7] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  )

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">System Monitoring</h2>
          <p className="text-[#717171]">Real-time system metrics and performance.</p>
        </FadeIn>
        <Button variant="outline" onClick={loadMetrics}>
          <RefreshCw className="size-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-[#FF385C]" />
                <CardDescription>CPU Usage</CardDescription>
              </div>
              <CardTitle className="text-2xl">{metrics?.cpu.usage ?? "—"}%</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar value={metrics?.cpu.usage ?? 0} color="#FF385C" />
              <p className="text-xs text-[#717171] mt-2">{metrics?.cpu.cores} cores • {metrics?.cpu.model?.split(" ").slice(0, 3).join(" ")}</p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-[#00A699]" />
                <CardDescription>Memory</CardDescription>
              </div>
              <CardTitle className="text-2xl">{metrics?.memory.percent ?? "—"}%</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar value={metrics?.memory.percent ?? 0} color="#00A699" />
              <p className="text-xs text-[#717171] mt-2">{metrics ? formatBytes(metrics.memory.used) : "—"} / {metrics ? formatBytes(metrics.memory.total) : "—"}</p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="size-4 text-[#FFB400]" />
                <CardDescription>Disk</CardDescription>
              </div>
              <CardTitle className="text-2xl">{metrics?.disk.percent ?? "—"}%</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar value={metrics?.disk.percent ?? 0} color="#FFB400" />
              <p className="text-xs text-[#717171] mt-2">{metrics ? formatBytes(metrics.disk.used) : "—"} / {metrics ? formatBytes(metrics.disk.total) : "—"}</p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-[#717171]" />
                <CardDescription>System</CardDescription>
              </div>
              <CardTitle className="text-lg">{metrics?.hostname || "—"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={metrics?.gateway === "running" ? "success" : "destructive"}>
                  Gateway {metrics?.gateway}
                </Badge>
              </div>
              <p className="text-xs text-[#717171] mt-2">Uptime: {metrics ? formatUptime(metrics.uptime) : "—"}</p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">CPU Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cpu" stroke="#FF385C" fill="#FF385C" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.35}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Memory Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mem" stroke="#00A699" fill="#00A699" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Load Average */}
      {metrics && (
        <FadeIn delay={0.4}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Load Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-[#717171]">1 min</p>
                  <p className="text-lg font-bold">{metrics.loadAvg[0]?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717171]">5 min</p>
                  <p className="text-lg font-bold">{metrics.loadAvg[1]?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717171]">15 min</p>
                  <p className="text-lg font-bold">{metrics.loadAvg[2]?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </PageTransition>
  )
}
