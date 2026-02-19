"use client"

import { useEffect, useState, useCallback } from "react"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileEdit, Save, Sparkles, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

const CodeMirror = dynamic(() => import("@uiw/react-codemirror").then((m) => m.default), { ssr: false })

export default function EditorPage() {
  const [files, setFiles] = useState<string[]>([])
  const [currentFile, setCurrentFile] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetch("/api/files").then((r) => r.json()).then((d) => {
      setFiles(d.files || [])
      if (d.files?.length && !currentFile) {
        loadFile(d.files[0])
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadFile = async (file: string) => {
    setCurrentFile(file)
    const res = await fetch(`/api/files?file=${encodeURIComponent(file)}`)
    const data = await res.json()
    setContent(data.content || "")
  }

  const saveFile = useCallback(async () => {
    if (!currentFile) return
    setSaving(true)
    try {
      await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: currentFile, content }),
      })
      toast.success(`${currentFile} saved`)
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }, [currentFile, content])

  const aiSuggest = async () => {
    setAiLoading(true)
    try {
      // Simple AI suggestion via OpenAI-compatible API
      toast.info("AI suggestions require OPENAI_API_KEY in .env.local")
    } finally {
      setAiLoading(false)
    }
  }

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        saveFile()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [saveFile])

  return (
    <PageTransition>
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7]">Markdown Editor</h2>
            <p className="text-[#717171]">Edit workspace files with syntax highlighting.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={aiSuggest} disabled={aiLoading}>
              <Sparkles className="size-4 mr-2" /> AI Suggest
            </Button>
            <Button onClick={saveFile} disabled={saving}>
              <Save className="size-4 mr-2" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Selector */}
        <div className="space-y-2">
          <FadeIn delay={0.1}>
            <p className="text-sm font-medium text-[#717171] mb-3">Files</p>
            {files.map((file) => (
              <button
                key={file}
                onClick={() => loadFile(file)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                  currentFile === file
                    ? "bg-[#FF385C]/10 text-[#FF385C] font-medium"
                    : "text-[#717171] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]"
                }`}
              >
                <FileEdit className="size-3.5" />
                {file}
              </button>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => fetch("/api/files").then((r) => r.json()).then((d) => setFiles(d.files || []))}>
              <RefreshCw className="size-3.5 mr-2" /> Refresh
            </Button>
          </FadeIn>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileEdit className="size-4 text-[#FF385C]" />
                    {currentFile || "Select a file"}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    {content.length} chars • {content.split("\n").length} lines
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-[#EBEBEB] dark:border-[#333333]">
                  <CodeMirror
                    value={content}
                    onChange={(val: string) => setContent(val)}
                    height="600px"
                    className="text-sm"
                    basicSetup={{ lineNumbers: true, foldGutter: true }}
                  />
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  )
}
