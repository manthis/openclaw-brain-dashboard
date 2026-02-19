import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const LOCAL_SKILLS = process.env.OPENCLAW_SKILLS_LOCAL_PATH || path.join(process.env.HOME || "", ".openclaw/workspace/skills")
const GLOBAL_SKILLS = process.env.OPENCLAW_SKILLS_GLOBAL_PATH || "/opt/homebrew/lib/node_modules/openclaw/skills"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  for (const dir of [LOCAL_SKILLS, GLOBAL_SKILLS]) {
    const skillPath = path.join(dir, name)
    try {
      await fs.access(skillPath)
      const files: Record<string, string> = {}
      const entries = await fs.readdir(skillPath)
      for (const f of entries) {
        const stat = await fs.stat(path.join(skillPath, f))
        if (stat.isFile() && stat.size < 100000) {
          files[f] = await fs.readFile(path.join(skillPath, f), "utf-8")
        }
      }
      return NextResponse.json({ name, path: skillPath, files })
    } catch { continue }
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const { file, content } = await request.json()
  const skillPath = path.join(LOCAL_SKILLS, name)
  await fs.writeFile(path.join(skillPath, file), content)
  return NextResponse.json({ success: true })
}
