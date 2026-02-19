import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[#DDDDDD] dark:border-[#333333] placeholder:text-[#717171] focus-visible:border-[#222222] dark:focus-visible:border-[#F7F7F7] focus-visible:ring-[#222222]/10 dark:focus-visible:ring-[#F7F7F7]/10 dark:bg-[#2A2A2A] flex field-sizing-content min-h-16 w-full rounded-xl border bg-white px-4 py-3 text-base shadow-none transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
