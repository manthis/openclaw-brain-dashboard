import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const WORKSPACE = process.env.OPENCLAW_WORKSPACE_PATH || path.join(process.env.HOME || "", ".openclaw/workspace")

const ALLOWED_FILES = [
  "MEMORY.md", "SOUL.md", "USER.md", "TOOLS.md", "AGENTS.md", "HEARTBEAT.md",
]

async function getMemoryFiles() {
  const memDir = path.join(WORKSPACE, "memory")
  try {
    const entries = await fs.readdir(memDir)
    return entries.filter((f) => f.endsWith(".md")).map((f) => `memory/${f}`)
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file")

  if (!file) {
    const memoryFiles = await getMemoryFiles()
    const available = []
    for (const f of [...ALLOWED_FILES, ...memoryFiles]) {
      try {
        await fs.access(path.join(WORKSPACE, f))
        available.push(f)
      } catch {
        available.push(f) // still list even if doesn't exist yet
      }
    }
    return NextResponse.json({ files: available })
  }

  // Validate file path
  if (!ALLOWED_FILES.includes(file) && !file.startsWith("memory/")) {
    return NextResponse.json({ error: "File not allowed" }, { status: 403 })
  }

  const filePath = path.join(WORKSPACE, file)
  try {
    const content = await fs.readFile(filePath, "utf-8")
    return NextResponse.json({ file, content })
  } catch {
    return NextResponse.json({ file, content: "" })
  }
}

export async function PUT(request: NextRequest) {
  const { file, content } = await request.json()

  if (!ALLOWED_FILES.includes(file) && !file.startsWith("memory/")) {
    return NextResponse.json({ error: "File not allowed" }, { status: 403 })
  }

  const filePath = path.join(WORKSPACE, file)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
  return NextResponse.json({ success: true })
}
