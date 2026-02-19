"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({ className, children, ...props }: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  // Extract only safe HTML props, skip event handlers that conflict with framer-motion
  const { style, id, role, "aria-label": ariaLabel, ...rest } = props as Record<string, unknown>
  const safeProps: Record<string, unknown> = {}
  if (style) safeProps.style = style
  if (id) safeProps.id = id
  if (role) safeProps.role = role
  if (ariaLabel) safeProps["aria-label"] = ariaLabel

  // Forward data-* attributes
  for (const key of Object.keys(rest)) {
    if (key.startsWith("data-")) {
      safeProps[key] = rest[key]
    }
  }

  return (
    <motion.div
      data-slot="skeleton"
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn("bg-[#EBEBEB] dark:bg-[#333333] rounded-xl", className)}
      {...safeProps}
    >
      {children}
    </motion.div>
  )
}

export { Skeleton }
