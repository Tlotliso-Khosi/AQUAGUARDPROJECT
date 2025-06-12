"use client";

import * as React from "react";
import { Cloud, Droplets, Sun, Wind, ThermometerSun, CloudRain, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";

const weeklyForecast = [
  { day: "Mon", temp: 22, humidity: 65, rainfall: 0, wind: 12 },
  { day: "Tue", temp: 24, humidity: 62, rainfall: 0, wind: 10 },
  { day: "Wed", temp: 23, humidity: 68, rainfall: 15, wind: 15 },
  { day: "Thu", temp: 21, humidity: 70, rainfall: 20, wind: 18 },
  { day: "Fri", temp: 20, humidity: 72, rainfall: 5, wind: 14 },
  { day: "Sat", temp: 22, humidity: 65, rainfall: 0, wind: 11 },
  { day: "Sun", temp: 23, humidity: 63, rainfall: 0, wind: 9 },
];

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  description?: string;
  color?: string;
}

function WeatherCard({ title, value, unit, icon, description, color = "slate-900" }: WeatherCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-slate-600">{title}</CardTitle>
        {React.isValidElement(icon) && React.cloneElement(icon, {
          className: `h-5 w-5 text-${color}`,
          "aria-hidden": "true"
        } as React.SVGProps<SVGSVGElement>)}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            <span className="text-sm text-slate-600">{unit}</span>
          </div>
          {description && (
            <span className="mt-1 text-sm text-slate-500">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-600">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weeklyForecast}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis yAxisId="temp" stroke="#f97316" />
              <YAxis yAxisId="rain" orientation="right" stroke="#0ea5e9" />
              <Tooltip />
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                fill="url(#tempGradient)"
                name="Temperature (°C)"
              />
              <Area
                yAxisId="rain"
                type="monotone"
                dataKey="rainfall"
                stroke="#0ea5e9"
                fill="url(#rainGradient)"
                name="Rainfall (mm)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WeatherPage() {

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Weather Forecast</h2>
          <p className="text-sm text-slate-500">Real-time weather insights for optimal farming decisions</p>
        </div>
        <div className="relative w-[280px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search regions..."
            className="pl-9 pr-4"
              />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <WeatherCard
          title="Temperature"
          value={22}
          unit="°C"
          icon={<ThermometerSun />}
          description="Optimal for crop growth"
          color="orange-500"
        />
        <WeatherCard
          title="Humidity"
          value={65}
          unit="%"
          icon={<Droplets />}
          description="Moderate humidity levels"
          color="blue-500"
        />
        <WeatherCard
          title="Wind Speed"
          value={12}
          unit="km/h"
          icon={<Wind />}
          description="Light breeze"
          color="slate-600"
        />
        <WeatherCard
          title="Rainfall"
          value={0}
          unit="mm"
          icon={<CloudRain />}
          description="No rain expected today"
          color="blue-600"
        />
      </div>

      <WeatherChart />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-slate-600">
              Agricultural Advisory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-orange-500" />
                Ideal conditions for crop spraying in the morning
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-slate-500" />
                Light cloud cover expected in the afternoon
              </li>
              <li className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Consider irrigation due to low rainfall forecast
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-slate-600">
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                <div className="font-medium">Frost Warning</div>
                <p className="mt-1 text-yellow-700">
                  Possible frost conditions expected this weekend. Protect sensitive crops.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <div className="font-medium">Rain Alert</div>
                <p className="mt-1 text-blue-700">
                  Light showers expected on Wednesday. Plan field operations accordingly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 