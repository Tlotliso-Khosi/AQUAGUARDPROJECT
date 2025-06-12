"use client";

import * as React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle,  } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Droplet, Thermometer, Wind, Sun, Leaf, TrendingUp, Calendar, RefreshCw, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  time: string;
  moisture: number;
  temperature: number;
  humidity: number;
  light: number;
  windSpeed: number;
}

interface FieldMetrics {
  id: string;
  name: string;
  cropType: string;
  area: number;
  health: number;
  status: "healthy" | "warning" | "critical";
  lastIrrigated: string;
  nextIrrigation: string;
}

const fieldData = {
  "field-1": [
    { time: "00:00", moisture: 45, temperature: 22, humidity: 65, light: 0, windSpeed: 5 },
    { time: "04:00", moisture: 42, temperature: 21, humidity: 68, light: 0, windSpeed: 4 },
    { time: "08:00", moisture: 48, temperature: 24, humidity: 63, light: 45, windSpeed: 6 },
    { time: "12:00", moisture: 50, temperature: 26, humidity: 60, light: 85, windSpeed: 8 },
    { time: "16:00", moisture: 47, temperature: 25, humidity: 62, light: 65, windSpeed: 7 },
    { time: "20:00", moisture: 44, temperature: 23, humidity: 64, light: 20, windSpeed: 5 },
    { time: "24:00", moisture: 45, temperature: 22, humidity: 65, light: 0, windSpeed: 4 },
  ],
  "field-2": [
    { time: "00:00", moisture: 38, temperature: 19, humidity: 72, light: 0, windSpeed: 3 },
    { time: "04:00", moisture: 36, temperature: 18, humidity: 74, light: 0, windSpeed: 2 },
    { time: "08:00", moisture: 42, temperature: 23, humidity: 68, light: 50, windSpeed: 4 },
    { time: "12:00", moisture: 46, temperature: 27, humidity: 62, light: 90, windSpeed: 6 },
    { time: "16:00", moisture: 44, temperature: 26, humidity: 64, light: 70, windSpeed: 5 },
    { time: "20:00", moisture: 40, temperature: 22, humidity: 70, light: 25, windSpeed: 3 },
    { time: "24:00", moisture: 38, temperature: 19, humidity: 72, light: 0, windSpeed: 2 },
  ],
  "field-3": [
    { time: "00:00", moisture: 28, temperature: 24, humidity: 58, light: 0, windSpeed: 8 },
    { time: "04:00", moisture: 25, temperature: 22, humidity: 60, light: 0, windSpeed: 7 },
    { time: "08:00", moisture: 30, temperature: 28, humidity: 55, light: 60, windSpeed: 10 },
    { time: "12:00", moisture: 32, temperature: 32, humidity: 50, light: 95, windSpeed: 12 },
    { time: "16:00", moisture: 30, temperature: 30, humidity: 52, light: 75, windSpeed: 11 },
    { time: "20:00", moisture: 29, temperature: 26, humidity: 56, light: 30, windSpeed: 9 },
    { time: "24:00", moisture: 28, temperature: 24, humidity: 58, light: 0, windSpeed: 8 },
  ],
  "field-4": [
    { time: "00:00", moisture: 55, temperature: 20, humidity: 75, light: 0, windSpeed: 2 },
    { time: "04:00", moisture: 53, temperature: 19, humidity: 77, light: 0, windSpeed: 1 },
    { time: "08:00", moisture: 58, temperature: 22, humidity: 72, light: 35, windSpeed: 3 },
    { time: "12:00", moisture: 62, temperature: 24, humidity: 68, light: 75, windSpeed: 4 },
    { time: "16:00", moisture: 60, temperature: 23, humidity: 70, light: 55, windSpeed: 3 },
    { time: "20:00", moisture: 57, temperature: 21, humidity: 73, light: 15, windSpeed: 2 },
    { time: "24:00", moisture: 55, temperature: 20, humidity: 75, light: 0, windSpeed: 1 },
  ],
};

const fields: FieldMetrics[] = [
  {
    id: "field-1",
    name: "North Field",
    cropType: "Tomatoes",
    area: 5.2,
    health: 92,
    status: "healthy",
    lastIrrigated: "2024-03-15 14:30",
    nextIrrigation: "2024-03-16 08:00",
  },
  {
    id: "field-2",
    name: "South Field",
    cropType: "Lettuce",
    area: 3.8,
    health: 85,
    status: "warning",
    lastIrrigated: "2024-03-15 15:45",
    nextIrrigation: "2024-03-16 09:30",
  },
  {
    id: "field-3",
    name: "East Field",
    cropType: "Carrots",
    area: 4.5,
    health: 78,
    status: "critical",
    lastIrrigated: "2024-03-15 13:15",
    nextIrrigation: "2024-03-16 07:00",
  },
  {
    id: "field-4",
    name: "West Field",
    cropType: "Potatoes",
    area: 6.0,
    health: 95,
    status: "healthy",
    lastIrrigated: "2024-03-15 16:00",
    nextIrrigation: "2024-03-16 10:00",
  },
];

const cropDistribution = [
  { name: "Tomatoes", value: 30 },
  { name: "Lettuce", value: 20 },
  { name: "Carrots", value: 25 },
  { name: "Potatoes", value: 25 },
];

const FIELD_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const statusColors = {
  healthy: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
};

interface MultiFieldChartCardProps {
  title: string;
  dataKey: keyof Omit<ChartData, 'time'>;
  color: string;
  unit: string;
  icon: React.ReactNode;
}

function MultiFieldChartCard({ title, dataKey, unit, icon }: MultiFieldChartCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState<string[]>(fields.map(f => f.id));

  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => setIsLoading(false), 800);
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refreshData} 
            className="h-8 w-8"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap gap-1">
          {fields.map((field) => (
            <Badge 
              key={field.id}
              variant={selectedFields.includes(field.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleField(field.id)}
            >
              {field.name}
            </Badge>
          ))}
        </div>
        <div className="h-[200px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-[180px] w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
              >
                <defs>
                  {fields.map((field, index) => (
                    <linearGradient key={field.id} id={`gradient-${field.id}-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={FIELD_COLORS[index]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={FIELD_COLORS[index]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}${unit}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                {fields
                  .filter(field => selectedFields.includes(field.id))
                  .map((field, index) => (
                    <Area
                      key={field.id}
                      type="monotone"
                      dataKey={dataKey}
                      data={fieldData[field.id as keyof typeof fieldData]}
                      name={field.name}
                      stroke={FIELD_COLORS[index]}
                      fill={`url(#gradient-${field.id}-${dataKey})`}
                      strokeWidth={2}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState("24h");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  
  const filteredFields = React.useMemo(() => {
    if (statusFilter === "all") return fields;
    return fields.filter(field => field.status === statusFilter);
  }, [statusFilter]);

  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Check for critical alerts
  const criticalFields = fields.filter(field => field.status === "critical");
  const hasAlerts = criticalFields.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Field Analytics</h2>
          <p className="text-muted-foreground">
            Monitor field conditions and crop health across all locations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="12h">Last 12 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {hasAlerts && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Alerts</AlertTitle>
          <AlertDescription>
            {criticalFields.map(field => (
              <div key={field.id} className="mt-1">
                {field.name} requires immediate attention.
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="fields">Field Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <MultiFieldChartCard
              title="Soil Moisture"
              dataKey="moisture"
              color="#0ea5e9"
              unit="%"
              icon={<Droplet className="h-4 w-4 text-blue-500" />}
            />
            <MultiFieldChartCard
              title="Temperature"
              dataKey="temperature"
              color="#f97316"
              unit="°C"
              icon={<Thermometer className="h-4 w-4 text-orange-500" />}
            />
            <MultiFieldChartCard
              title="Humidity"
              dataKey="humidity"
              color="#8b5cf6"
              unit="%"
              icon={<Wind className="h-4 w-4 text-purple-500" />}
            />
            <MultiFieldChartCard
              title="Light Intensity"
              dataKey="light"
              color="#eab308"
              unit="%"
              icon={<Sun className="h-4 w-4 text-yellow-500" />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="fields">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Field Details</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredFields.map((field) => (
                  <Card key={field.id} className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{field.name}</CardTitle>
                      <Badge variant="secondary" className={statusColors[field.status]}>
                        {field.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Leaf className="mr-2 h-4 w-4 text-green-500" />
                          {field.cropType}
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                          {field.area} acres
                        </div>
                        <div className="flex items-center text-sm">
                          <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                          Last: {field.lastIrrigated}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                          Next: {field.nextIrrigation}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
