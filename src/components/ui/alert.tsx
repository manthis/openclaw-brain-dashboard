import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border border-[#EBEBEB] px-5 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-1 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-[#222222] text-[#222222] dark:text-[#F7F7F7]",
        destructive:
          "text-[#FF385C] bg-[#FF385C]/5 border-[#FF385C]/20 [&>svg]:text-[#FF385C] *:data-[slot=alert-description]:text-[#FF385C]/80",
        success:
          "text-[#00A699] bg-[#00A699]/5 border-[#00A699]/20 [&>svg]:text-[#00A699] *:data-[slot=alert-description]:text-[#00A699]/80",
        warning:
          "text-[#FFB400] bg-[#FFB400]/5 border-[#FFB400]/20 [&>svg]:text-[#FFB400] *:data-[slot=alert-description]:text-[#FFB400]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-[#717171] col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
