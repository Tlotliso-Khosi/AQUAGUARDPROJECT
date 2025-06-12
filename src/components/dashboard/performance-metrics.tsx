"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"

const metrics = [
  {
    name: "Yield per Hectare",
    current: "450 kg",
    previous: "420 kg",
    change: "+7.1%",
    trend: "up",
  },
  {
    name: "Water Usage",
    current: "2,500 L",
    previous: "2,800 L",
    change: "-10.7%",
    trend: "down",
  },
  {
    name: "Crop Health",
    current: "92%",
    previous: "88%",
    change: "+4.5%",
    trend: "up",
  },
  {
    name: "Resource Efficiency",
    current: "85%",
    previous: "82%",
    change: "+3.7%",
    trend: "up",
  },
]

export function PerformanceMetrics() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Current</TableHead>
            <TableHead>Previous</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name}>
              <TableCell className="font-medium">{metric.name}</TableCell>
              <TableCell>{metric.current}</TableCell>
              <TableCell>{metric.previous}</TableCell>
              <TableCell>
                <Badge
                  variant={metric.trend === "up" ? "default" : "destructive"}
                >
                  {metric.change}
                </Badge>
              </TableCell>
              <TableCell>
                {metric.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 