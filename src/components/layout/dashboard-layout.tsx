"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, LayoutDashboard, Puzzle, FileEdit, Settings, Clock, Monitor, GitBranch, Activity, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/skills", label: "Skills", icon: Puzzle },
  { href: "/editor", label: "Editor", icon: FileEdit },
  { href: "/config", label: "Config", icon: Settings },
  { href: "/crons", label: "Cron Jobs", icon: Clock },
  { href: "/monitoring", label: "Monitoring", icon: Monitor },
  { href: "/git", label: "Git", icon: GitBranch },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1A1A1A] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#222222] border-r border-[#EBEBEB] dark:border-[#333333] flex flex-col transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#EBEBEB] dark:border-[#333333]">
          <div className="flex items-center justify-center size-9 rounded-xl bg-[#FF385C] text-white">
            <Brain className="size-5" strokeWidth={1.75} />
          </div>
          <span className="text-lg font-bold text-[#222222] dark:text-[#F7F7F7]">OpenClaw</span>
          <Badge variant="success" className="ml-auto text-[10px]">v1</Badge>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#FF385C]/10 text-[#FF385C]"
                    : "text-[#717171] hover:text-[#222222] dark:hover:text-[#F7F7F7] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A]"
                )}
              >
                <item.icon className="size-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#EBEBEB] dark:border-[#333333]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#717171] hover:text-[#FF385C] hover:bg-[#FF385C]/10 transition-colors w-full"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 border-b border-[#EBEBEB] dark:border-[#333333] bg-white/80 dark:bg-[#222222]/80 backdrop-blur-sm lg:hidden">
          <div className="flex items-center px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-5" />
            </Button>
            <span className="ml-3 font-bold text-[#222222] dark:text-[#F7F7F7]">OpenClaw Brain</span>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
