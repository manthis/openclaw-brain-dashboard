"use client"

import { PageTransition, FadeIn } from "@/components/motion/page-transition"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, Zap, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1A1A1A]">
      <PageTransition>
        {/* Header */}
        <header className="border-b border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#222222]">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-[#FF385C] text-white">
                <Brain className="size-5" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-bold text-[#222222] dark:text-[#F7F7F7]">
                OpenClaw Brain
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success">Online</Badge>
              <Button variant="ghost" size="icon">
                <Settings className="size-5" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-6xl px-6 py-10">
          <FadeIn delay={0.05}>
            <h2 className="text-3xl font-bold text-[#222222] dark:text-[#F7F7F7] mb-2">
              Dashboard
            </h2>
            <p className="text-[#717171] mb-8">
              Monitor and manage your OpenClaw Brain instance.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-[#FF385C]/10 text-[#FF385C]">
                      <Activity className="size-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <CardTitle>Status</CardTitle>
                      <CardDescription>System health</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#222222] dark:text-[#F7F7F7]">
                    Healthy
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-[#00A699]/10 text-[#00A699]">
                      <Zap className="size-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <CardTitle>Sessions</CardTitle>
                      <CardDescription>Active connections</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#222222] dark:text-[#F7F7F7]">
                    3
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-[#FFB400]/10 text-[#FFB400]">
                      <Brain className="size-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <CardTitle>Memory</CardTitle>
                      <CardDescription>Knowledge base</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#222222] dark:text-[#F7F7F7]">
                    128 entries
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
