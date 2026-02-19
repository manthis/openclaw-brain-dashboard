import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const CONFIG_PATH = process.env.OPENCLAW_CONFIG_PATH || path.join(process.env.HOME || "", ".openclaw/config.json")

export async function GET() {
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf-8")
    return NextResponse.json({ config: JSON.parse(content), path: CONFIG_PATH })
  } catch (e) {
    return NextResponse.json({ config: {}, path: CONFIG_PATH, error: String(e) })
  }
}

export async function PUT(request: NextRequest) {
  const { config } = await request.json()
  // Validate JSON
  try {
    JSON.parse(JSON.stringify(config))
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  // Backup
  try {
    const existing = await fs.readFile(CONFIG_PATH, "utf-8")
    await fs.writeFile(CONFIG_PATH + ".backup", existing)
  } catch {}
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
  return NextResponse.json({ success: true })
}
