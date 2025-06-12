"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Filter, Database, CheckCircle2, Clock, X, AlertCircle, Loader2 } from "lucide-react"
import { YieldDataTable } from "@/components/dashboard/yield-data-table"
import { DataQualityMetrics } from "@/components/dashboard/data-quality-metrics"
import { DataValidationRules } from "@/components/dashboard/data-validation-rules"
import { DataImportHistory } from "@/components/dashboard/data-import-history"
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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface NewDataForm {
  field_id: string
  crop_type: string
  yield_amount: string
  unit: string
  measurement_date: string
  notes: string
}

interface Field {
  id: number
  fieldname: string
}

interface Statistics {
  totalRecords: number
  lastUpdated: string | null
  currentMonthRecords: number
  lastMonthRecords: number
  growthPercentage: number
}

export default function DataManagementPage() {
  const [open, setOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [formData, setFormData] = useState<NewDataForm>({
    field_id: "",
    crop_type: "",
    yield_amount: "",
    unit: "kg",
    measurement_date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportSelection, setExportSelection] = useState("all")
  const [notification, setNotification] = useState<{
    show: boolean
    title: string
    message: string
    type: "success" | "error"
  }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  })
  const [cropTypes, setCropTypes] = useState<string[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showNotification = (title: string, message: string, type: "success" | "error") => {
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

  // Fetch crop types from the API
  const fetchCropTypes = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching crop types from:", "http://localhost:5000/api/crop-types")

      const response = await fetch("http://localhost:5000/api/crop-types", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Crop types fetched successfully:", data)
      setCropTypes(data.cropTypes || [])
    } catch (error) {
      console.error("Error fetching crop types:", error)
      setError(`Error fetching crop types: ${error.message}`)
    }
  }

  // Fetch fields from the API
  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:5000/api/fields-dropdown", {
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
    } catch (error: any) {
      console.error("Error fetching fields:", error.message)
      setError(`Error fetching fields: ${error.message}`)
    }
  }

  // Improve the fetchStatistics function with better error handling
  // Replace the existing fetchStatistics function with this:

  // Fetch statistics from the API
  const fetchStatistics = async () => {
    setIsLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching statistics from:", "http://localhost:5000/api/field-data/statistics")

      const response = await fetch("http://localhost:5000/api/field-data/statistics", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      // Log the response status and headers for debugging
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]))

      // Get the response as text first for debugging
      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error(`Server returned invalid JSON. Raw response: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.message || `Server responded with status: ${response.status}`)
      }

      console.log("Statistics fetched successfully:", data)

      // Validate the statistics object structure
      if (!data.statistics) {
        console.warn("Statistics object is missing in the response:", data)
        throw new Error("Invalid response format: statistics object is missing")
      }

      setStatistics(data.statistics)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      setError(`Error fetching statistics: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Validate form data
      if (
        !formData.field_id ||
        !formData.crop_type ||
        !formData.yield_amount ||
        !formData.unit ||
        !formData.measurement_date
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Convert yield amount to number
      const yieldAmount = Number.parseFloat(formData.yield_amount)
      if (isNaN(yieldAmount) || yieldAmount <= 0) {
        throw new Error("Yield amount must be a positive number")
      }

      const dataToSubmit = {
        field_id: Number.parseInt(formData.field_id),
        crop_type: formData.crop_type,
        yield_amount: yieldAmount,
        unit: formData.unit,
        measurement_date: formData.measurement_date,
        notes: formData.notes || null,
      }

      console.log("Submitting data:", dataToSubmit)

      const response = await fetch("http://localhost:5000/api/field-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add field data")
      }

      const result = await response.json()
      console.log("Field data added successfully:", result)

      // Reset form and close dialog
      setFormData({
        field_id: "",
        crop_type: "",
        yield_amount: "",
        unit: "kg",
        measurement_date: new Date().toISOString().split("T")[0],
        notes: "",
      })
      setOpen(false)

      // Show success notification
      showNotification("Data Added", "New yield data has been added successfully", "success")

      // Refresh statistics and data table
      fetchStatistics()
      // If you have a function to refresh the data table, call it here
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("refresh-field-data"))
      }
    } catch (error: any) {
      console.error("Error adding field data:", error.message)
      setError(`Error adding field data: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!selectedFile) {
      showNotification("No file selected", "Please select a file to import", "error")
      return
    }

    // Simulate file import process
    setIsImporting(true)
    setImportProgress(0)

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsImporting(false)
          setImportDialogOpen(false)
          setSelectedFile(null)
          showNotification("Import successful", `Successfully imported data from ${selectedFile.name}`, "success")
          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  const handleExport = () => {
    // Simulate export process
    showNotification("Export started", `Exporting data as ${exportFormat.toUpperCase()}...`, "success")

    // Simulate processing delay
    setTimeout(() => {
      // Create a fake download
      const element = document.createElement("a")
      const file = new Blob(["Sample data export content"], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `agricultural_data_export.${exportFormat}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      showNotification("Export complete", `Your data has been exported as ${exportFormat.toUpperCase()}`, "success")
      setExportDialogOpen(false)
    }, 1500)
  }

  const clearFileSelection = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Format time ago
  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMins > 0) {
      return `${diffMins}m ago`
    } else {
      return `${diffSecs}s ago`
    }
  }

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("No authentication token found in localStorage")
      setError("No authentication token found. Please log in.")
    } else {
      console.log("Token found in localStorage")
      // Fetch data when component mounts
      fetchCropTypes()
      fetchFields()
      fetchStatistics()
    }
  }, [])

  // Add this near your other useEffect hooks
  useEffect(() => {
    const handleRefreshData = () => {
      fetchStatistics()
    }

    window.addEventListener("refresh-field-data", handleRefreshData)

    return () => {
      window.removeEventListener("refresh-field-data", handleRefreshData)
    }
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {notification.show && (
        <Alert
          className={`fixed top-4 right-4 w-auto max-w-md z-50 ${notification.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
        >
          <AlertCircle className={`h-4 w-4 ${notification.type === "success" ? "text-green-600" : "text-red-600"}`} />
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Management</h2>
          <p className="text-muted-foreground">Manage and maintain your agricultural data quality</p>
        </div>
        <Button onClick={fetchStatistics} variant="outline" size="sm">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statistics?.totalRecords || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics && statistics.growthPercentage !== 0
                    ? `${statistics.growthPercentage > 0 ? "+" : ""}${statistics.growthPercentage.toFixed(1)}% from last month`
                    : "No change from last month"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality Score</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">High quality data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statistics?.lastUpdated ? formatTimeAgo(statistics.lastUpdated) : "Never"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.lastUpdated ? formatDate(statistics.lastUpdated) : "No data available"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Data Entry</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="import">Import History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Yield Data</CardTitle>
                  <CardDescription>Enter and manage your yield data</CardDescription>
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <YieldDataTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Metrics</CardTitle>
              <CardDescription>Monitor data quality and completeness</CardDescription>
            </CardHeader>
            <CardContent>
              <DataQualityMetrics />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Rules</CardTitle>
              <CardDescription>Configure data validation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <DataValidationRules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>Track data import operations</CardDescription>
            </CardHeader>
            <CardContent>
              <DataImportHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management Settings</CardTitle>
              <CardDescription>Configure data management preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
        <TooltipProvider>
          {/* Add New Data Button */}
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
                <p>Add New Data</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Yield Data</DialogTitle>
                  <DialogDescription>Enter the details for your new yield data entry.</DialogDescription>
                </DialogHeader>

                {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">{error}</div>}

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field_id" className="text-right">
                      Field
                    </Label>
                    <Select
                      name="field_id"
                      value={formData.field_id}
                      onValueChange={(value) => handleSelectChange("field_id", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.length > 0 ? (
                          fields.map((field) => (
                            <SelectItem key={field.id} value={field.id.toString()}>
                              {field.fieldname}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No fields available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="crop_type" className="text-right">
                      Crop Type
                    </Label>
                    <Select
                      name="crop_type"
                      value={formData.crop_type}
                      onValueChange={(value) => handleSelectChange("crop_type", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.length > 0 ? (
                          cropTypes.map((cropType) => (
                            <SelectItem key={cropType} value={cropType}>
                              {cropType}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No crop types available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="yield_amount" className="text-right">
                      Yield Amount
                    </Label>
                    <Input
                      id="yield_amount"
                      name="yield_amount"
                      type="number"
                      step="0.01"
                      className="col-span-3"
                      placeholder="Enter yield amount"
                      value={formData.yield_amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">
                      Unit
                    </Label>
                    <Select
                      name="unit"
                      value={formData.unit}
                      onValueChange={(value) => handleSelectChange("unit", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="bushels">Bushels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="measurement_date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="measurement_date"
                      name="measurement_date"
                      type="date"
                      className="col-span-3"
                      value={formData.measurement_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      className="col-span-3"
                      placeholder="Optional notes about this data entry"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Data"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Import Button */}
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Upload className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Import Data</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
                <DialogDescription>Upload a CSV or Excel file to import data.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <Button variant="ghost" size="icon" onClick={clearFileSelection}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Import Options</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="headers" defaultChecked />
                      <Label htmlFor="headers" className="font-normal">
                        File contains headers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="replace" />
                      <Label htmlFor="replace" className="font-normal">
                        Replace existing data
                      </Label>
                    </div>
                  </div>
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <Label>Import Progress</Label>
                    <Progress value={importProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">Importing... {importProgress}%</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)} disabled={isImporting}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Export Button */}
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Download className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Export Data</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Data</DialogTitle>
                <DialogDescription>Export your agricultural data in various formats.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exportSelection">Data to Export</Label>
                  <Select value={exportSelection} onValueChange={setExportSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data</SelectItem>
                      <SelectItem value="filtered">Current Filtered View</SelectItem>
                      <SelectItem value="selected">Selected Records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Export Options</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="includeHeaders" defaultChecked />
                      <Label htmlFor="includeHeaders" className="font-normal">
                        Include column headers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="includeMetadata" />
                      <Label htmlFor="includeMetadata" className="font-normal">
                        Include metadata
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport}>Export</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  )
}
