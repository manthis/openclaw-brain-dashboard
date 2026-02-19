import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const GLOBAL_SKILLS = process.env.OPENCLAW_SKILLS_GLOBAL_PATH || "/opt/homebrew/lib/node_modules/openclaw/skills"
const LOCAL_SKILLS = process.env.OPENCLAW_SKILLS_LOCAL_PATH || path.join(process.env.HOME || "", ".openclaw/workspace/skills")

async function getSkillsFromDir(dir: string, source: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const skills = []
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = path.join(dir, entry.name)
        let description = ""
        let hasConfig = false
        try {
          const md = await fs.readFile(path.join(skillPath, "SKILL.md"), "utf-8")
          description = md.split("\n").find((l) => l && !l.startsWith("#"))?.trim() || ""
        } catch {}
        try {
          await fs.access(path.join(skillPath, "config.env"))
          hasConfig = true
        } catch {}
        const files = await fs.readdir(skillPath)
        skills.push({ name: entry.name, source, path: skillPath, description, hasConfig, files })
      }
    }
    return skills
  } catch {
    return []
  }
}

export async function GET() {
  const [global, local] = await Promise.all([
    getSkillsFromDir(GLOBAL_SKILLS, "global"),
    getSkillsFromDir(LOCAL_SKILLS, "local"),
  ])
  return NextResponse.json({ skills: [...global, ...local] })
}

export async function POST(request: NextRequest) {
  const { name, description } = await request.json()
  const skillDir = path.join(LOCAL_SKILLS, name)
  await fs.mkdir(skillDir, { recursive: true })
  await fs.writeFile(path.join(skillDir, "SKILL.md"), `# ${name}\n\n${description || "New skill"}\n`)
  await fs.writeFile(path.join(skillDir, "config.env"), "# Skill configuration\n")
  return NextResponse.json({ success: true, path: skillDir })
}

export async function DELETE(request: NextRequest) {
  const { path: skillPath } = await request.json()
  if (!skillPath.includes(".openclaw")) {
    return NextResponse.json({ error: "Cannot delete non-local skills" }, { status: 403 })
  }
  await fs.rm(skillPath, { recursive: true })
  return NextResponse.json({ success: true })
}
