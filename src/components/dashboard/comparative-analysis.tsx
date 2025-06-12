"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  {
    metric: "Yield",
    current: 450,
    previous: 420,
    change: "+7.1%",
  },
  {
    metric: "Water Usage",
    current: 2500,
    previous: 2800,
    change: "-10.7%",
  },
  {
    metric: "Crop Health",
    current: 92,
    previous: 88,
    change: "+4.5%",
  },
  {
    metric: "Resource Efficiency",
    current: 85,
    previous: 82,
    change: "+3.7%",
  },
]

export function ComparativeAnalysis() {
  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="current"
              fill="#2563eb"
              name="Current Period"
            />
            <Bar
              dataKey="previous"
              fill="#6b7280"
              name="Previous Period"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Key Insights</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Yield has improved by 7.1% compared to the previous period</li>
            <li>• Water usage has decreased by 10.7%, showing better efficiency</li>
            <li>• Crop health has increased by 4.5%</li>
            <li>• Overall resource efficiency has improved by 3.7%</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Recommendations</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Continue optimizing water usage based on current success</li>
            <li>• Monitor crop health metrics closely to maintain improvement</li>
            <li>• Consider scaling successful practices to other fields</li>
            <li>• Review resource allocation based on efficiency gains</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 