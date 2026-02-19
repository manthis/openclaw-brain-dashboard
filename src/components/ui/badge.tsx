import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#FF385C] text-white [a&]:hover:bg-[#E0294D]",
        secondary:
          "bg-[#F7F7F7] text-[#222222] dark:bg-[#2A2A2A] dark:text-[#F7F7F7] [a&]:hover:bg-[#EBEBEB]",
        destructive:
          "bg-[#FF385C] text-white [a&]:hover:bg-[#E0294D]",
        outline:
          "border-[#DDDDDD] text-[#222222] dark:text-[#F7F7F7] [a&]:hover:bg-[#F7F7F7] dark:[a&]:hover:bg-[#2A2A2A]",
        success:
          "bg-[#00A699]/10 text-[#00A699] border-[#00A699]/20",
        warning:
          "bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]/20",
        ghost: "[a&]:hover:bg-[#F7F7F7] [a&]:hover:text-[#222222]",
        link: "text-[#FF385C] underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
