"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Mock data - replace with actual data from your backend
const monthlyData = [
  {
    name: "Jan",
    maize: 400,
    wheat: 240,
    sorghum: 300,
  },
  {
    name: "Feb",
    maize: 450,
    wheat: 280,
    sorghum: 350,
  },
  {
    name: "Mar",
    maize: 500,
    wheat: 300,
    sorghum: 400,
  },
]

const cropDistribution = [
  {
    name: "Maize",
    yield: 500,
  },
  {
    name: "Wheat",
    yield: 300,
  },
  {
    name: "Sorghum",
    yield: 400,
  },
  {
    name: "Beans",
    yield: 200,
  },
  {
    name: "Potatoes",
    yield: 350,
  },
]

export function YieldCharts() {
  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Monthly Yield Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="maize"
              stroke="#8884d8"
              name="Maize"
            />
            <Line
              type="monotone"
              dataKey="wheat"
              stroke="#82ca9d"
              name="Wheat"
            />
            <Line
              type="monotone"
              dataKey="sorghum"
              stroke="#ffc658"
              name="Sorghum"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Current Crop Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cropDistribution}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yield" fill="#8884d8" name="Yield (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 