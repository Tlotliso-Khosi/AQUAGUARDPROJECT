"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Map,
  Layers,
  PenTool,
  Ruler,
  MapPin,
  Droplet,
  Thermometer,
  Cloud,
  AlertCircle,
  Plus,
  Minus,
  Compass,
  Crop,
  Eye,
  EyeOff,
  Save,
  Share2,
  Search,
  Zap,
  Leaf,
  BarChart3,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data for fields
const mockFields = [
  {
    id: "field-1",
    name: "North Field",
    area: 5.2,
    cropType: "Tomatoes",
    soilType: "Loamy",
    center: { lat: -13.9626, lng: 33.7741 },
    status: "active",
    soilMoisture: 68,
    temperature: 24.5,
  },
  {
    id: "field-2",
    name: "South Field",
    area: 3.8,
    cropType: "Lettuce",
    soilType: "Sandy",
    center: { lat: -13.9726, lng: 33.7841 },
    status: "active",
    soilMoisture: 72,
    temperature: 23.8,
  },
  {
    id: "field-3",
    name: "East Field",
    area: 4.5,
    cropType: "Carrots",
    soilType: "Clay",
    center: { lat: -13.9526, lng: 33.7941 },
    status: "maintenance",
    soilMoisture: 55,
    temperature: 25.2,
  },
  {
    id: "field-4",
    name: "West Field",
    area: 6.0,
    cropType: "Potatoes",
    soilType: "Loamy",
    center: { lat: -13.9626, lng: 33.7641 },
    status: "fallow",
    soilMoisture: 45,
    temperature: 26.1,
  },
]

// Mock data for weather
const mockWeather = {
  temperature: 25,
  humidity: 65,
  windSpeed: 8,
  windDirection: "NE",
  precipitation: 0,
  forecast: [
    { day: "Today", temp: 25, icon: "sunny" },
    { day: "Tomorrow", temp: 27, icon: "partly-cloudy" },
    { day: "Wed", temp: 26, icon: "cloudy" },
    { day: "Thu", temp: 24, icon: "rainy" },
    { day: "Fri", temp: 23, icon: "rainy" },
  ],
}

export default function MapManagementPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [mapZoom, setMapZoom] = useState(14)
  const [mapCenter, setMapCenter] = useState({ lat: -13.9626, lng: 33.7741 }) // Example coordinates in Malawi
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [visibleLayers, setVisibleLayers] = useState({
    fields: true,
    soilMoisture: false,
    temperature: false,
    cropHealth: false,
    satellite: true,
  })
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [layersDialogOpen, setLayersDialogOpen] = useState(false)
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    title: string
    message: string
    type: "success" | "error" | "warning"
  }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  })

  // Mock function to simulate map initialization
  useEffect(() => {
    if (!mounted && mapRef.current) {
      // In a real implementation, this would initialize a map library like Leaflet or Mapbox
      console.log("Map initialized")
      setMounted(true)

      // Simulate loading map tiles
      const timer = setTimeout(() => {
        showNotification("Map Loaded", "All map tiles and field data loaded successfully", "success")
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  const showNotification = (title: string, message: string, type: "success" | "error" | "warning") => {
    setNotification({
      show: true,
      title,
      message,
      type,
    })

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 5))
  }

  const handleLayerToggle = (layer: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const handleToolSelect = (tool: string) => {
    if (activeTool === tool) {
      setActiveTool(null)
      showNotification("Tool Deactivated", `${tool} tool has been deactivated`, "success")
    } else {
      setActiveTool(tool)
      showNotification("Tool Activated", `${tool} tool is now active`, "success")
    }
  }

  const handleFieldSelect = (fieldId: string) => {
    const field = mockFields.find((f) => f.id === fieldId)
    if (field) {
      setSelectedField(fieldId)
      setMapCenter(field.center)
      showNotification("Field Selected", `${field.name} is now selected`, "success")
    }
  }

  const handleShareMap = () => {
    // Generate a shareable link with current map state
    const shareableLink = `https://aquaguard.example.com/map?lat=${mapCenter.lat}&lng=${mapCenter.lng}&zoom=${mapZoom}&layers=${Object.entries(
      visibleLayers,
    )
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(",")}`

    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        showNotification("Link Copied", "Shareable map link has been copied to clipboard", "success")
        setShareDialogOpen(false)
      },
      () => {
        showNotification("Copy Failed", "Failed to copy link to clipboard", "error")
      },
    )
  }

  const handleRunAnalysis = () => {
    showNotification("Analysis Started", "Spatial analysis is running. This may take a moment...", "success")

    // Simulate analysis running
    setTimeout(() => {
      showNotification("Analysis Complete", "Spatial analysis has been completed successfully", "success")
      setAnalysisDialogOpen(false)
    }, 2500)
  }

  const getMoistureColor = (moisture: number) => {
    if (moisture < 50) return "bg-amber-100 text-amber-800"
    if (moisture < 65) return "bg-green-100 text-green-800"
    return "bg-blue-100 text-blue-800"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 25) return "bg-red-100 text-red-800"
    if (temp > 22) return "bg-green-100 text-green-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {notification.show && (
        <Alert
          className={`fixed top-4 right-4 w-auto max-w-md z-50 ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <AlertCircle
            className={`h-4 w-4 ${
              notification.type === "success"
                ? "text-green-600"
                : notification.type === "error"
                  ? "text-red-600"
                  : "text-amber-600"
            }`}
          />
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Field Mapping</h2>
          <p className="text-muted-foreground">Visualize and analyze your agricultural fields spatially</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background border rounded-md px-3 py-1">
            <Compass className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-background border rounded-md px-3 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Zoom: {mapZoom}x</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19.5 acres</div>
            <p className="text-xs text-muted-foreground">Across {mockFields.length} fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Soil Moisture</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockFields.reduce((acc, field) => acc + field.soilMoisture, 0) / mockFields.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Optimal range: 60-75%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWeather.temperature}°C</div>
            <p className="text-xs text-muted-foreground">
              Humidity: {mockWeather.humidity}%, Wind: {mockWeather.windSpeed} km/h {mockWeather.windDirection}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Forecast</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {mockWeather.forecast.slice(0, 3).map((day) => (
                <div key={day.day} className="text-center">
                  <div className="text-xs">{day.day}</div>
                  <div className="font-medium">{day.temp}°</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Field List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Fields</CardTitle>
            <CardDescription>Select a field to view on map</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search fields..." className="pl-8" />
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {mockFields.map((field) => (
                <div
                  key={field.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedField === field.id ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50 border-border"
                  }`}
                  onClick={() => handleFieldSelect(field.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{field.name}</h4>
                      <p className="text-xs text-muted-foreground">{field.cropType}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        field.status === "active"
                          ? "bg-green-100 text-green-800"
                          : field.status === "fallow"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {field.status}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{field.area} acres</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crop className="h-3 w-3" />
                      <span>{field.soilType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplet className="h-3 w-3" />
                      <Badge variant="secondary" className={getMoistureColor(field.soilMoisture)}>
                        {field.soilMoisture}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      <Badge variant="secondary" className={getTemperatureColor(field.temperature)}>
                        {field.temperature}°C
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Map Area */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs defaultValue="map" className="space-y-4">
            <TabsList>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="satellite">Satellite View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="3d">3D View</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardContent className="p-0 relative">
                  {/* Map Container */}
                  <div
                    ref={mapRef}
                    className="w-full h-[600px] bg-slate-100 relative overflow-hidden rounded-md"
                    style={{
                      backgroundImage: "url('/placeholder.svg?height=600&width=800')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Map Overlay - This would be replaced by actual map library in real implementation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!mounted && <p className="text-lg font-medium">Loading map...</p>}
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button size="icon" variant="secondary" onClick={handleZoomIn}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" onClick={handleZoomOut}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Separator className="my-1" />
                      <Button
                        size="icon"
                        variant={activeTool === "measure" ? "default" : "secondary"}
                        onClick={() => handleToolSelect("measure")}
                      >
                        <Ruler className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={activeTool === "draw" ? "default" : "secondary"}
                        onClick={() => handleToolSelect("draw")}
                      >
                        <PenTool className="h-4 w-4" />
                      </Button>
                      <Separator className="my-1" />
                      <Button
                        size="icon"
                        variant={visibleLayers.fields ? "default" : "secondary"}
                        onClick={() => handleLayerToggle("fields")}
                      >
                        {visibleLayers.fields ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Field Info Overlay - Would show when a field is selected */}
                    {selectedField && (
                      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-72 bg-background/95 backdrop-blur-sm p-4 rounded-md border shadow-md">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">
                            {mockFields.find((f) => f.id === selectedField)?.name || "Selected Field"}
                          </h3>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => setSelectedField(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Crop:</span>{" "}
                              {mockFields.find((f) => f.id === selectedField)?.cropType}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Area:</span>{" "}
                              {mockFields.find((f) => f.id === selectedField)?.area} acres
                            </div>
                            <div>
                              <span className="text-muted-foreground">Soil:</span>{" "}
                              {mockFields.find((f) => f.id === selectedField)?.soilType}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>{" "}
                              <Badge
                                variant="secondary"
                                className={
                                  mockFields.find((f) => f.id === selectedField)?.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : mockFields.find((f) => f.id === selectedField)?.status === "fallow"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {mockFields.find((f) => f.id === selectedField)?.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Soil Moisture</span>
                              <span className="text-xs font-medium">
                                {mockFields.find((f) => f.id === selectedField)?.soilMoisture}%
                              </span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{
                                  width: `${mockFields.find((f) => f.id === selectedField)?.soilMoisture}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="pt-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Temperature</span>
                              <span className="text-xs font-medium">
                                {mockFields.find((f) => f.id === selectedField)?.temperature}°C
                              </span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (mockFields.find((f) => f.id === selectedField)?.temperature || 0) > 25
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${
                                    ((mockFields.find((f) => f.id === selectedField)?.temperature || 0) / 40) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="satellite" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div
                    className="w-full h-[600px] bg-slate-100 relative overflow-hidden rounded-md"
                    style={{
                      backgroundImage: "url('/placeholder.svg?height=600&width=800')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "saturate(1.2) contrast(1.1)",
                    }}
                  >
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-sm">
                      Satellite imagery last updated: 2 days ago
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spatial Analytics</CardTitle>
                  <CardDescription>Analyze field data spatially</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Soil Moisture Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-md">
                          <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Temperature Heatmap</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center bg-slate-50 rounded-md">
                          <Thermometer className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Button onClick={() => setAnalysisDialogOpen(true)}>Run New Analysis</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="3d" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="w-full h-[600px] bg-slate-100 relative overflow-hidden rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">3D View</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mt-2">
                        Experience your fields in 3D with elevation data, crop growth models, and more. This feature
                        requires additional data processing.
                      </p>
                      <Button className="mt-4">Enable 3D View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
        <TooltipProvider>
          {/* Layers Button */}
          <Dialog open={layersDialogOpen} onOpenChange={setLayersDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Layers className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Map Layers</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Map Layers</DialogTitle>
                <DialogDescription>Toggle visibility of different map layers.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <Label htmlFor="fields-layer" className="font-normal">
                        Field Boundaries
                      </Label>
                    </div>
                    <Switch
                      id="fields-layer"
                      checked={visibleLayers.fields}
                      onCheckedChange={() => handleLayerToggle("fields")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplet className="h-4 w-4" />
                      <Label htmlFor="moisture-layer" className="font-normal">
                        Soil Moisture
                      </Label>
                    </div>
                    <Switch
                      id="moisture-layer"
                      checked={visibleLayers.soilMoisture}
                      onCheckedChange={() => handleLayerToggle("soilMoisture")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4" />
                      <Label htmlFor="temperature-layer" className="font-normal">
                        Temperature
                      </Label>
                    </div>
                    <Switch
                      id="temperature-layer"
                      checked={visibleLayers.temperature}
                      onCheckedChange={() => handleLayerToggle("temperature")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4" />
                      <Label htmlFor="crop-health-layer" className="font-normal">
                        Crop Health
                      </Label>
                    </div>
                    <Switch
                      id="crop-health-layer"
                      checked={visibleLayers.cropHealth}
                      onCheckedChange={() => handleLayerToggle("cropHealth")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Map className="h-4 w-4" />
                      <Label htmlFor="satellite-layer" className="font-normal">
                        Satellite Imagery
                      </Label>
                    </div>
                    <Switch
                      id="satellite-layer"
                      checked={visibleLayers.satellite}
                      onCheckedChange={() => handleLayerToggle("satellite")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Layer Opacity</Label>
                  <Slider defaultValue={[80]} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <Label>Base Map</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select base map" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLayersDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    showNotification("Layers Updated", "Map layers have been updated", "success")
                    setLayersDialogOpen(false)
                  }}
                >
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Analysis Button */}
          <Dialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <BarChart3 className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Spatial Analysis</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Spatial Analysis</DialogTitle>
                <DialogDescription>Analyze field data using spatial algorithms.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select defaultValue="moisture">
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moisture">Soil Moisture Distribution</SelectItem>
                      <SelectItem value="temperature">Temperature Heatmap</SelectItem>
                      <SelectItem value="yield">Yield Prediction</SelectItem>
                      <SelectItem value="irrigation">Irrigation Optimization</SelectItem>
                      <SelectItem value="custom">Custom Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fields to Include</Label>
                  <div className="space-y-2">
                    {mockFields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox id={`field-${field.id}`} defaultChecked />
                        <Label htmlFor={`field-${field.id}`} className="font-normal">
                          {field.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Parameters</Label>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="resolution" className="text-xs">
                        Resolution
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Faster)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High (Detailed)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="date-range" className="text-xs">
                        Date Range
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="start-date"
                          type="date"
                          defaultValue={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        />
                        <Input id="end-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAnalysisDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRunAnalysis}>Run Analysis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Share Button */}
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Share2 className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Share Map</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Map</DialogTitle>
                <DialogDescription>Share the current map view with others.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Current Map View</Label>
                  <div className="bg-muted p-2 rounded-md text-sm">
                    <div className="flex justify-between">
                      <span>Center:</span>
                      <span className="font-mono">
                        {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zoom:</span>
                      <span className="font-mono">{mapZoom}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visible Layers:</span>
                      <span className="font-mono">
                        {Object.entries(visibleLayers)
                          .filter(([_, value]) => value)
                          .map(([key]) => key)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Share Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-layers" defaultChecked />
                      <Label htmlFor="include-layers" className="font-normal">
                        Include visible layers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-markers" defaultChecked />
                      <Label htmlFor="include-markers" className="font-normal">
                        Include field markers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-selection" defaultChecked />
                      <Label htmlFor="include-selection" className="font-normal">
                        Include selected field
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="share-link">Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input
                      id="share-link"
                      readOnly
                      value={`https://aquaguard.example.com/map?lat=${mapCenter.lat.toFixed(4)}&lng=${mapCenter.lng.toFixed(4)}&zoom=${mapZoom}`}
                    />
                    <Button variant="outline" size="icon" onClick={handleShareMap}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleShareMap}>Copy Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Save Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full h-14 w-14 shadow-lg"
                onClick={() => {
                  showNotification("Map Saved", "Current map view has been saved", "success")
                }}
              >
                <Save className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Save Map</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
