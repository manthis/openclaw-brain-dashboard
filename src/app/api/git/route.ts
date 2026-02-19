import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)
const WORKSPACE = process.env.OPENCLAW_WORKSPACE_PATH || path.join(process.env.HOME || "", ".openclaw/workspace")

async function git(cmd: string) {
  try {
    const { stdout } = await execAsync(`git ${cmd}`, { cwd: WORKSPACE, timeout: 15000 })
    return stdout.trim()
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string }
    throw new Error(err.stderr || err.stdout || String(e))
  }
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") || "status"

  try {
    if (action === "status") {
      const [status, branch, remote] = await Promise.all([
        git("status --porcelain"),
        git("branch --show-current"),
        git("remote -v").catch(() => ""),
      ])
      return NextResponse.json({
        status: status.split("\n").filter(Boolean).map((l) => ({
          status: l.substring(0, 2).trim(),
          file: l.substring(3),
        })),
        branch,
        remote,
      })
    }

    if (action === "log") {
      const log = await git('log --oneline -30 --format="%H|%h|%s|%an|%ar"')
      const commits = log.split("\n").filter(Boolean).map((l) => {
        const [hash, short, message, author, date] = l.split("|")
        return { hash, short, message, author, date }
      })
      return NextResponse.json({ commits })
    }

    if (action === "branches") {
      const branches = await git("branch -a")
      const current = await git("branch --show-current")
      return NextResponse.json({
        branches: branches.split("\n").map((b) => b.trim().replace("* ", "")),
        current,
      })
    }

    if (action === "diff") {
      const diff = await git("diff --stat")
      const fullDiff = await git("diff")
      return NextResponse.json({ stat: diff, diff: fullDiff })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { action, message, files } = await request.json()

  try {
    if (action === "commit") {
      if (files?.length) {
        await git(`add ${files.join(" ")}`)
      } else {
        await git("add -A")
      }
      const output = await git(`commit -m "${message || "Update from dashboard"}"`)
      return NextResponse.json({ success: true, output })
    }

    if (action === "push") {
      const output = await git("push")
      return NextResponse.json({ success: true, output })
    }

    if (action === "pull") {
      const output = await git("pull")
      return NextResponse.json({ success: true, output })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
