"use client"

import { useEffect, useState, useCallback } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, RotateCcw, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

const CodeMirror = dynamic(() => import("@uiw/react-codemirror").then((m) => m.default), { ssr: false })

export default function ConfigPage() {
  const [config, setConfig] = useState("")
  const [configPath, setConfigPath] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [saving, setSaving] = useState(false)
  const [original, setOriginal] = useState("")

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((d) => {
      const formatted = JSON.stringify(d.config, null, 2)
      setConfig(formatted)
      setOriginal(formatted)
      setConfigPath(d.path)
    })
  }, [])

  const validate = (value: string) => {
    try {
      JSON.parse(value)
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
    setConfig(value)
  }

  const save = useCallback(async () => {
    if (!isValid) return toast.error("Invalid JSON")
    setSaving(true)
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: JSON.parse(config) }),
      })
      setOriginal(config)
      toast.success("Config saved (backup created)")
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }, [config, isValid])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [save])

  const hasChanges = config !== original

  return (
    <PageTransition>
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Configuration</h2>
            <p className="text-[#717171]">Edit OpenClaw config.json</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setConfig(original); setIsValid(true) }} disabled={!hasChanges}>
              <RotateCcw className="size-4 mr-2" /> Reset
            </Button>
            <Button onClick={save} disabled={!isValid || saving || !hasChanges}>
              <Save className="size-4 mr-2" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="size-4 text-[#FF385C]" />
                {configPath}
              </CardTitle>
              <div className="flex items-center gap-2">
                {hasChanges && <Badge variant="outline" className="text-[10px]">Modified</Badge>}
                {isValid ? (
                  <Badge variant="success" className="text-[10px] flex items-center gap-1">
                    <CheckCircle className="size-2.5" /> Valid JSON
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-[10px] flex items-center gap-1">
                    <AlertCircle className="size-2.5" /> Invalid JSON
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-[#EBEBEB] dark:border-[#333333]">
              <CodeMirror
                value={config}
                onChange={validate}
                height="600px"
                className="text-sm"
                basicSetup={{ lineNumbers: true, foldGutter: true }}
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  )
}
