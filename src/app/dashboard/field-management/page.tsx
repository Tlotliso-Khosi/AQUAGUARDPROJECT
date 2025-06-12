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
  Loader2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Field {
  id: string | number
  fieldname: string
  location: string
  area: number
  croptype: string
  status: "active" | "fallow" | "maintenance"
  soiltype: string
  drainage?: "good" | "moderate" | "poor"
  last_irrigated?: string
  next_irrigation?: string
  created_at: string
  updated_at: string
}

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
  const [drainage, setDrainage] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [macAddress, setMacAddress] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [deviceErrorMessage, setDeviceErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentFieldId, setCurrentFieldId] = useState<string | number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null)

  // Fetch fields from the API
  const fetchFields = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:5000/api/fields", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch fields")
      }

      const data = await response.json()
      console.log("Fields fetched successfully:", data)
      setFields(data.fields || [])
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching fields:", error.message)
        setErrorMessage("Error fetching fields: " + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        setErrorMessage("An unexpected error occurred while fetching fields.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle device submission
  const handleDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeviceErrorMessage("")

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

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Using token:", token)
      console.log("Device data:", deviceData)

      const response = await fetch("http://localhost:5000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add device")
      }

      const result = await response.json()
      console.log("Device added successfully:", result)

      alert("Device added successfully!")
      setDeviceDialogOpen(false)
      setDeviceName("")
      setMacAddress("")

      // Optionally refresh devices list here if you have one
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Device addition error:", error.message)
        setDeviceErrorMessage("Error adding device: " + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        setDeviceErrorMessage("An unexpected error occurred.")
      }
    }
  }

  // Handle field submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      const fieldData = {
        fieldname,
        location,
        area,
        croptype,
        status,
        soiltype,
        drainage,
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Using token:", token)
      console.log("Field data:", fieldData)

      let url = "http://localhost:5000/api/fields"
      let method = "POST"

      // If in edit mode, use PUT method and include the field ID in the URL
      if (isEditMode && currentFieldId) {
        url = `http://localhost:5000/api/fields/${currentFieldId}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fieldData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${isEditMode ? "update" : "add"} field`)
      }

      const result = await response.json()
      console.log(`Field ${isEditMode ? "updated" : "added"} successfully:`, result)

      alert(`Field ${isEditMode ? "updated" : "added"} successfully!`)
      setOpen(false)
      resetFieldForm()

      // Refresh the fields list
      fetchFields()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Field ${isEditMode ? "update" : "addition"} error:`, error.message)
        setErrorMessage(`Error ${isEditMode ? "updating" : "adding"} field: ` + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        setErrorMessage("An unexpected error occurred.")
      }
    }
  }

  // Handle field deletion
  const handleDeleteField = async () => {
    if (!fieldToDelete) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`http://localhost:5000/api/fields/${fieldToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete field")
      }

      console.log("Field deleted successfully")
      alert("Field deleted successfully!")

      // Refresh the fields list
      fetchFields()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Field deletion error:", error.message)
        alert("Error deleting field: " + error.message)
      } else {
        console.error("An unexpected error occurred:", error)
        alert("An unexpected error occurred while deleting the field.")
      }
    } finally {
      setDeleteDialogOpen(false)
      setFieldToDelete(null)
    }
  }

  // Open edit dialog with field data
  const handleEditField = (field: Field) => {
    setIsEditMode(true)
    setCurrentFieldId(field.id)
    setFieldname(field.fieldname)
    setLocation(field.location)
    setArea(field.area)
    setCroptype(field.croptype)
    setStatus(field.status)
    setSoiltype(field.soiltype)
    setDrainage(field.drainage || "moderate")
    setOpen(true)
  }

  // Open delete confirmation dialog
  const handleDeleteConfirmation = (field: Field) => {
    setFieldToDelete(field)
    setDeleteDialogOpen(true)
  }

  // Reset field form
  const resetFieldForm = () => {
    setIsEditMode(false)
    setCurrentFieldId(null)
    setFieldname("")
    setLocation("")
    setArea("")
    setCroptype("")
    setStatus("")
    setSoiltype("")
    setDrainage("")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  useEffect(() => {
    setMounted(true)

    // Check if token exists
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("No authentication token found in localStorage")
    } else {
      console.log("Token found in localStorage")
      // Fetch fields when component mounts
      fetchFields()
    }
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
          <Button onClick={fetchFields} variant="outline" size="sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
            Refresh Fields
          </Button>
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
              {fields.reduce((acc, field) => acc + Number(field.area), 0).toFixed(1)} acres
            </div>
            <p className="text-xs text-muted-foreground">
              {fields.length > 0
                ? `Average: ${(fields.reduce((acc, field) => acc + Number(field.area), 0) / fields.length).toFixed(
                    1,
                  )} acres`
                : "No fields available"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(fields.map((f) => f.croptype)).size}</div>
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
              {errorMessage && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">{errorMessage}</div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading fields...</span>
                </div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields found. Add your first field using the + button.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Crop Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.fieldname}</TableCell>
                          <TableCell>{field.location}</TableCell>
                          <TableCell>{field.area} acres</TableCell>
                          <TableCell>{field.croptype}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusColors[field.status]}>
                              {field.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(field.updated_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditField(field)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(field)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading fields...</span>
                </div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields found. Add your first field using the + button.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field) => (
                    <Card key={field.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{field.fieldname}</CardTitle>
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
                            {field.croptype}
                          </div>
                          <div className="flex items-center text-sm">
                            <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                            Soil: {field.soiltype}
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                            Updated: {formatDate(field.updated_at)}
                          </div>
                          {field.drainage && (
                            <div className="flex items-center text-sm">
                              <Badge
                                variant="secondary"
                                className={drainageColors[field.drainage as "good" | "moderate" | "poor"]}
                              >
                                {field.drainage} drainage
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this field?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the field
              {fieldToDelete && <strong> "{fieldToDelete.fieldname}"</strong>} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteField} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

                {deviceErrorMessage && (
                  <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">{deviceErrorMessage}</div>
                )}

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

          <Dialog
            open={open}
            onOpenChange={(newOpen) => {
              if (!newOpen) {
                resetFieldForm()
              }
              setOpen(newOpen)
            }}
          >
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
                  <DialogTitle>{isEditMode ? "Edit Field" : "Add New Field"}</DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the details for your agricultural field."
                      : "Enter the details for your new agricultural field."}
                  </DialogDescription>
                </DialogHeader>

                {errorMessage && <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">{errorMessage}</div>}

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
                      required
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
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="area" className="text-right">
                      Area (acres)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      className="col-span-3"
                      placeholder="Enter area"
                      value={area}
                      onChange={(e) => setArea(e.target.value ? Number.parseFloat(e.target.value) : "")}
                      required
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
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Input
                      id="status"
                      className="col-span-3"
                      placeholder="active, fallow, or maintenance"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="soiltype" className="text-right">
                      Soil Type
                    </Label>
                    <Input
                      id="soiltype"
                      className="col-span-3"
                      placeholder="loamy, sandy, or clay"
                      value={soiltype}
                      onChange={(e) => setSoiltype(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="drainage" className="text-right">
                      Drainage
                    </Label>
                    <Input
                      id="drainage"
                      className="col-span-3"
                      placeholder="good, moderate, or poor"
                      value={drainage}
                      onChange={(e) => setDrainage(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetFieldForm()
                      setOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{isEditMode ? "Update Field" : "Add Field"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  )
}
