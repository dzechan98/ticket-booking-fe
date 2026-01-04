import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  color?: "primary" | "accent" | "green" | "blue"
}

export function StatCard({ title, value, description, icon, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary",
    accent: "text-accent",
    green: "text-green-600",
    blue: "text-blue-600",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`text-2xl ${colorClasses[color]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
