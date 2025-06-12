"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { month: "Jan", actual: 400, predicted: 420 },
  { month: "Feb", actual: 420, predicted: 440 },
  { month: "Mar", actual: 450, predicted: 460 },
  { month: "Apr", actual: 480, predicted: 490 },
  { month: "May", actual: 500, predicted: 510 },
  { month: "Jun", actual: 520, predicted: 530 },
  { month: "Jul", actual: null, predicted: 550 },
  { month: "Aug", actual: null, predicted: 570 },
  { month: "Sep", actual: null, predicted: 590 },
]

export function ForecastAnalysis() {
  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Forecast Summary</h4>
          <p className="text-sm text-muted-foreground">
            Based on current trends and historical data, we predict a 15% increase
            in yield over the next three months. This forecast takes into account
            weather patterns, soil conditions, and crop health metrics.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Confidence Level</h4>
          <p className="text-sm text-muted-foreground">
            The AI model has a confidence level of 85% for these predictions,
            based on the quality and quantity of historical data available.
          </p>
        </div>
      </div>
    </div>
  )
} 