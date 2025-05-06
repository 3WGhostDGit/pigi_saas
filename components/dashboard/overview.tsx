'use client'

import React from 'react'

// TODO: Replace with actual chart implementation (e.g., using Recharts)
interface OverviewProps {
  data: any[] // Define a proper type for your chart data
}

export function Overview({ data }: OverviewProps) {
  return (
    <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground bg-muted rounded-md">
      Chart Implementation Placeholder (e.g., Recharts BarChart)
    </div>
  )
} 