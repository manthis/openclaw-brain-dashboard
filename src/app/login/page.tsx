"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { PageTransition, FadeIn } from "@/components/motion/page-transition"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push("/")
      } else {
        setError("Invalid credentials")
      }
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1A1A1A] flex items-center justify-center px-4">
      <PageTransition>
        <div className="w-full max-w-sm">
          <FadeIn delay={0.05}>
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-[#FF385C] text-white mb-4">
                <Brain className="size-7" strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl font-bold text-[#222222] dark:text-[#F7F7F7]">OpenClaw Brain</h1>
              <p className="text-[#717171] mt-1">Sign in to your dashboard</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171]"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-[#FF385C]">{error}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </PageTransition>
    </div>
  )
}
