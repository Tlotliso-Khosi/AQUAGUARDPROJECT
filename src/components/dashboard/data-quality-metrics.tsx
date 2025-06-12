"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DataQualityMetrics() {
  // Sample data quality metrics
  const metrics = [
    { name: "Completeness", value: 98, description: "Percentage of fields with complete data" },
    { name: "Accuracy", value: 95, description: "Percentage of data that passes validation rules" },
    { name: "Consistency", value: 92, description: "Percentage of data that is consistent across records" },
    { name: "Timeliness", value: 97, description: "Percentage of data that is up-to-date" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metrics.map((metric) => (
        <Card key={metric.name}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{metric.name}</h3>
              <span className="text-lg font-bold">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
