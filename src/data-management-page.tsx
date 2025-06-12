"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Filter, Database, CheckCircle2, Clock, X, AlertCircle } from "lucide-react"
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

interface NewDataForm {
  cropType: string
  yieldAmount: string
  unit: string
  date: string
  field: string
}

export default function DataManagementPage() {
  const [open, setOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [formData, setFormData] = useState<NewDataForm>({
    cropType: "",
    yieldAmount: "",
    unit: "",
    date: new Date().toISOString().split("T")[0] ?? "",
    field: "",
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
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
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Auto-refresh enabled</p>
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
              <DialogHeader>
                <DialogTitle>Add New Yield Data</DialogTitle>
                <DialogDescription>Enter the details for your new yield data entry.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cropType" className="text-right">
                    Crop Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="lettuce">Lettuce</SelectItem>
                      <SelectItem value="carrots">Carrots</SelectItem>
                      <SelectItem value="potatoes">Potatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="yieldAmount" className="text-right">
                    Yield Amount
                  </Label>
                  <Input id="yieldAmount" type="number" className="col-span-3" placeholder="Enter yield amount" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unit
                  </Label>
                  <Select>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field" className="text-right">
                    Field
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North Field</SelectItem>
                      <SelectItem value="south">South Field</SelectItem>
                      <SelectItem value="east">East Field</SelectItem>
                      <SelectItem value="west">West Field</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    setOpen(false)
                    showNotification("Data Added", "New yield data has been added successfully", "success")
                  }}
                >
                  Add Data
                </Button>
              </DialogFooter>
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
