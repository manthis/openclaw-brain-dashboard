import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import os from "os"

const execAsync = promisify(exec)

export async function GET() {
  const cpus = os.cpus()
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const uptime = os.uptime()
  const loadAvg = os.loadavg()

  // CPU usage (average across cores)
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
    const idle = cpu.times.idle
    return acc + ((total - idle) / total) * 100
  }, 0) / cpus.length

  // Disk usage
  let disk = { total: 0, used: 0, available: 0, percent: 0 }
  try {
    const { stdout } = await execAsync("df -k / | tail -1")
    const parts = stdout.trim().split(/\s+/)
    disk = {
      total: parseInt(parts[1]) * 1024,
      used: parseInt(parts[2]) * 1024,
      available: parseInt(parts[3]) * 1024,
      percent: parseInt(parts[4]),
    }
  } catch {}

  // OpenClaw gateway status
  let gatewayStatus = "unknown"
  try {
    const { stdout } = await execAsync("openclaw gateway status 2>/dev/null")
    gatewayStatus = stdout.includes("running") ? "running" : "stopped"
  } catch {
    gatewayStatus = "stopped"
  }

  return NextResponse.json({
    cpu: { usage: Math.round(cpuUsage * 10) / 10, cores: cpus.length, model: cpus[0]?.model },
    memory: { total: totalMem, used: usedMem, free: freeMem, percent: Math.round((usedMem / totalMem) * 100) },
    disk,
    uptime,
    loadAvg,
    gateway: gatewayStatus,
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    timestamp: Date.now(),
  })
}
