import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function runOC(args: string) {
  try {
    const { stdout } = await execAsync(`openclaw ${args}`, { timeout: 10000 })
    return stdout.trim()
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string }
    return err.stdout || err.stderr || String(e)
  }
}

export async function GET() {
  const output = await runOC("sessions list --json 2>/dev/null || openclaw sessions list")
  try {
    const sessions = JSON.parse(output)
    return NextResponse.json({ sessions })
  } catch {
    return NextResponse.json({ sessions: [], raw: output })
  }
}

export async function POST(request: NextRequest) {
  const { action, sessionId } = await request.json()
  if (action === "kill" && sessionId) {
    const output = await runOC(`sessions kill ${sessionId}`)
    return NextResponse.json({ success: true, output })
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
