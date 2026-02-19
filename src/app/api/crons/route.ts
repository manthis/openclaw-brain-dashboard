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
  const output = await runOC("cron list --json 2>/dev/null || openclaw cron list")
  try {
    const crons = JSON.parse(output)
    return NextResponse.json({ crons })
  } catch {
    // Parse text output
    return NextResponse.json({ crons: [], raw: output })
  }
}

export async function POST(request: NextRequest) {
  const { action, name, schedule, task, model, label } = await request.json()

  if (action === "create") {
    const args = [`cron add`, `--schedule "${schedule}"`, `--task "${task}"`]
    if (name) args.push(`--name "${name}"`)
    if (model) args.push(`--model "${model}"`)
    if (label) args.push(`--label "${label}"`)
    const output = await runOC(args.join(" "))
    return NextResponse.json({ success: true, output })
  }

  if (action === "delete") {
    const output = await runOC(`cron remove "${name}"`)
    return NextResponse.json({ success: true, output })
  }

  if (action === "run") {
    const output = await runOC(`cron run "${name}"`)
    return NextResponse.json({ success: true, output })
  }

  if (action === "toggle") {
    const output = await runOC(`cron toggle "${name}"`)
    return NextResponse.json({ success: true, output })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
