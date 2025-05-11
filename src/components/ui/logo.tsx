import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <h1 className={cn("text-4xl font-bold text-white mb-6 text-center", className)}>
      <span>finance-track</span>
    </h1>
  )
} 