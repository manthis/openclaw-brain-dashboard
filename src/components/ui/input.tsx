import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#717171] selection:bg-[#FF385C]/10 selection:text-[#222222] dark:bg-[#2A2A2A] border-[#DDDDDD] dark:border-[#333333] h-11 w-full min-w-0 rounded-xl border bg-white px-4 py-2 text-base transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#222222] dark:focus-visible:border-[#F7F7F7] focus-visible:ring-[#222222]/10 dark:focus-visible:ring-[#F7F7F7]/10 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
