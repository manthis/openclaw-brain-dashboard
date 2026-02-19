import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[#FF385C]/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FF385C] text-white hover:bg-[#E0294D] hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-[#DDDDDD] bg-white text-[#222222] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#F7F7F7] hover:shadow-md dark:bg-[#222222] dark:text-[#F7F7F7] dark:border-[#333333] dark:hover:bg-[#2A2A2A]",
        secondary:
          "bg-[#F7F7F7] text-[#222222] hover:bg-[#EBEBEB] dark:bg-[#2A2A2A] dark:text-[#F7F7F7] dark:hover:bg-[#333333]",
        ghost:
          "hover:bg-[#F7F7F7] hover:text-[#222222] dark:hover:bg-[#2A2A2A] dark:hover:text-[#F7F7F7]",
        link: "text-[#FF385C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-8 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
