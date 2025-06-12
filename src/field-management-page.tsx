"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  MapPin,
  Droplet,
  Leaf,
  TrendingUp,
  Calendar,
  Edit2,
  Trash2,
  AlertTriangle,
  Cpu,
  Home,
  BarChart3,
  Settings,
  Users,
  FileText,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Field {
  id: string
  name: string
  location: string
  area: number
  cropType: string
  status: "active" | "fallow" | "maintenance"
  lastIrrigated: string
  nextIrrigation: string
  soilType: string
  drainage: "good" | "moderate" | "poor"
}

const mockFields: Field[] = [
  {
    id: "field-1",
    name: "North Field",
    location: "North Section",
    area: 5.2,
    cropType: "Tomatoes",
    status: "active",
    lastIrrigated: "2024-03-15 14:30",
    nextIrrigation: "2024-03-16 08:00",
    soilType: "Loamy",
    drainage: "good",
  },
  {
    id: "field-2",
    name: "South Field",
    location: "South Section",
    area: 3.8,
    cropType: "Lettuce",
    status: "active",
    lastIrrigated: "2024-03-15 15:45",
    nextIrrigation: "2024-03-16 09:30",
    soilType: "Sandy",
    drainage: "moderate",
  },
  {
    id: "field-3",
    name: "East Field",
    location: "East Section",
    area: 4.5,
    cropType: "Carrots",
    status: "maintenance",
    lastIrrigated: "2024-03-15 13:15",
    nextIrrigation: "2024-03-16 07:00",
    soilType: "Clay",
    drainage: "poor",
  },
  {
    id: "field-4",
    name: "West Field",
    location: "West Section",
    area: 6.0,
    cropType: "Potatoes",
    status: "fallow",
    lastIrrigated: "2024-03-15 16:00",
    nextIrrigation: "2024-03-16 10:00",
    soilType: "Loamy",
    drainage: "good",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  fallow: "bg-yellow-100 text-yellow-800",
  maintenance: "bg-red-100 text-red-800",
}

const drainageColors = {
  good: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
}

// Navigation links for the mobile sidebar
const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
  { href: "/fields", label: "Field Management", icon: <MapPin className="h-4 w-4" /> },
  { href: "/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { href: "/devices", label: "Devices", icon: <Cpu className="h-4 w-4" /> },
  { href: "/reports", label: "Reports", icon: <FileText className="h-4 w-4" /> },
  { href: "/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { href: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]

export default function FieldManagementPage() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [fieldname, setFieldname] = useState("")
  const [location, setLocation] = useState("")
  const [area, setArea] = useState<number | "">("")
  const [croptype, setCroptype] = useState("")
  const [status, setStatus] = useState("")
  const [soiltype, setSoiltype] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [macAddress, setMacAddress] = useState("")

  // Add this handler function
  const handleDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate MAC address format
      const macRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/
      if (!macRegex.test(macAddress)) {
        throw new Error("MAC address must be in format XX:XX:XX:XX:XX:XX")
      }

      const deviceData = {
        name: deviceName,
        mac_address: macAddress.toUpperCase(), // Store in consistent format
        device_type: "sensor", // Default type, can be made configurable
      }

      const token = localStorage.getItem("access")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://127.0.0.1:8000/api/devices/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || "Failed to add device")
      }

      alert("Device added successfully!")
      setDeviceDialogOpen(false)
      setDeviceName("")
      setMacAddress("")

      // Optionally refresh devices list here if you have one
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Device addition error:", error.message)
        alert("Error adding device: " + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        alert("An unexpected error occurred.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData = {
        fieldname,
        location,
        area,
        croptype,
        status,
        soiltype,
      }

      const token = localStorage.getItem("token")
      console.log("Current token:", token)

      const response = await fetch("http://127.0.0.1:8000/fields/dashboard/field-management/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to add field")
      }

      alert("New Field added")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Field addition error:", error.message)
        alert("Error adding field: " + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        alert("An unexpected error occurred.")
      }
    }
  }

  useEffect(() => {
    setMounted(true)
    setFields(mockFields)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Field Management</h2>
          <p className="text-muted-foreground">Manage your agricultural fields and monitor their status</p>
        </div>
        <div className="flex gap-2">
          <div>{/* Buttons removed from here and moved to floating action buttons */}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.length}</div>
            <p className="text-xs text-muted-foreground">
              Active fields: {fields.filter((f) => f.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fields.reduce((acc, field) => acc + field.area, 0).toFixed(1)} acres
            </div>
            <p className="text-xs text-muted-foreground">
              Average: {(fields.reduce((acc, field) => acc + field.area, 0) / fields.length).toFixed(1)} acres
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(fields.map((f) => f.cropType)).size}</div>
            <p className="text-xs text-muted-foreground">Different crop types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.filter((f) => f.status === "maintenance").length}</div>
            <p className="text-xs text-muted-foreground">Fields needing attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Field Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Status Overview</CardTitle>
              <CardDescription>Current status of all fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Crop Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Irrigated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>{field.location}</TableCell>
                        <TableCell>{field.area} acres</TableCell>
                        <TableCell>{field.cropType}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[field.status]}>
                            {field.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{field.lastIrrigated}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Details</CardTitle>
              <CardDescription>Detailed information about each field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{field.name}</CardTitle>
                      <Badge variant="secondary" className={statusColors[field.status]}>
                        {field.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                          {field.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                          {field.area} acres
                        </div>
                        <div className="flex items-center text-sm">
                          <Leaf className="mr-2 h-4 w-4 text-green-500" />
                          {field.cropType}
                        </div>
                        <div className="flex items-center text-sm">
                          <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                          Last: {field.lastIrrigated}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                          Next: {field.nextIrrigation}
                        </div>
                        <div className="flex items-center text-sm">
                          <Badge variant="secondary" className={drainageColors[field.drainage]}>
                            {field.drainage} drainage
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Analytics</CardTitle>
              <CardDescription>Analytics and insights about your fields</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
        <TooltipProvider>
          <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Cpu className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Add Device</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleDeviceSubmit} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>Enter the details for your new IoT device.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deviceName" className="text-right">
                      Device Name
                    </Label>
                    <Input
                      id="deviceName"
                      className="col-span-3"
                      placeholder="Enter device name"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="macAddress" className="text-right">
                      MAC Address
                    </Label>
                    <Input
                      id="macAddress"
                      className="col-span-3"
                      placeholder="XX:XX:XX:XX:XX:XX"
                      value={macAddress}
                      onChange={(e) => setMacAddress(e.target.value)}
                      required
                      pattern="^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$"
                      title="MAC address format: XX:XX:XX:XX:XX:XX"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeviceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Device</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Plus className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Add New Field</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Add New Field</DialogTitle>
                  <DialogDescription>Enter the details for your new agricultural field.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fieldname" className="text-right">
                      Field Name
                    </Label>
                    <Input
                      id="fieldname"
                      className="col-span-3"
                      placeholder="Enter field name"
                      value={fieldname}
                      onChange={(e) => setFieldname(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      className="col-span-3"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="area" className="text-right">
                      Area (acres)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      className="col-span-3"
                      placeholder="Enter area"
                      value={area}
                      onChange={(e) => setArea(Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="croptype" className="text-right">
                      Crop Type
                    </Label>
                    <Input
                      id="croptype"
                      className="col-span-3"
                      placeholder="Enter crop type"
                      value={croptype}
                      onChange={(e) => setCroptype(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Input
                      id="status"
                      className="col-span-3"
                      placeholder="Active or Fallow or Maintenance"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="soiltype" className="text-right">
                      Soil Type
                    </Label>
                    <Input
                      id="soiltype"
                      className="col-span-3"
                      placeholder="Loamy or Sandy or Clay"
                      value={soiltype}
                      onChange={(e) => setSoiltype(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Field</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  )
}
