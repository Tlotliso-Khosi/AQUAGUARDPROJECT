"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, BarChart3, TrendingUp, FileText, Settings, AlertCircle, Mail } from "lucide-react"
import { YieldTrendChart } from "@/components/dashboard/yield-trend-chart"
import { CropDistributionChart } from "@/components/dashboard/crop-distribution-chart"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ForecastAnalysis } from "@/components/dashboard/forecast-analysis"
import { ComparativeAnalysis } from "@/components/dashboard/comparative-analysis"
import { ReportSchedule } from "@/components/dashboard/report-schedule"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"

export default function ReportsPage() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [reportName, setReportName] = useState("")
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

  const handleExport = () => {
    if (!exportFormat) {
      showNotification("Export Error", "Please select an export format", "error")
      return
    }

    // Simulate export process
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)

          // Create a fake download
          const element = document.createElement("a")
          const file = new Blob(["Sample report content"], { type: "text/plain" })
          element.href = URL.createObjectURL(file)
          element.download = `agricultural_report.${exportFormat}`
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)

          showNotification("Export Complete", `Report has been exported as ${exportFormat.toUpperCase()}`, "success")
          setExportDialogOpen(false)
          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  const handleSchedule = () => {
    if (!reportName) {
      showNotification("Schedule Error", "Please enter a report name", "error")
      return
    }

    if (!recipientEmail) {
      showNotification("Schedule Error", "Please enter recipient email", "error")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      showNotification("Schedule Error", "Please enter a valid email address", "error")
      return
    }

    // Simulate scheduling process
    showNotification(
      "Report Scheduled",
      `Your ${reportName} report will be sent ${scheduleFrequency} to ${recipientEmail}`,
      "success",
    )
    setScheduleDialogOpen(false)
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
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Analyze trends and generate insights from your agricultural data</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 kg/ha</div>
            <p className="text-xs text-muted-foreground">+8% vs last season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">M45,000</div>
            <p className="text-xs text-muted-foreground">+15% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Health</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Optimal health score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Efficiency</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Water usage efficiency</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Yield Trends</CardTitle>
                <CardDescription>Monthly yield performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <YieldTrendChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Current crop types distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <CropDistributionChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yield Forecasting</CardTitle>
              <CardDescription>AI-powered yield predictions and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis</CardTitle>
              <CardDescription>Compare performance across different periods</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparativeAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automated report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
        <TooltipProvider>
          {/* Export Report Button */}
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
                <p>Export Report</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Report</DialogTitle>
                <DialogDescription>Export your agricultural reports in various formats.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Report Sections</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="yieldTrends" defaultChecked />
                      <Label htmlFor="yieldTrends" className="font-normal">
                        Yield Trends
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cropDistribution" defaultChecked />
                      <Label htmlFor="cropDistribution" className="font-normal">
                        Crop Distribution
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="performanceMetrics" defaultChecked />
                      <Label htmlFor="performanceMetrics" className="font-normal">
                        Performance Metrics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="forecast" />
                      <Label htmlFor="forecast" className="font-normal">
                        Forecasting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="comparison" />
                      <Label htmlFor="comparison" className="font-normal">
                        Comparison
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="startDate" className="text-xs">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="endDate" className="text-xs">
                        End Date
                      </Label>
                      <Input id="endDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <Label>Export Progress</Label>
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">Exporting... {exportProgress}%</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExportDialogOpen(false)} disabled={isExporting}>
                  Cancel
                </Button>
                <Button onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Schedule Report Button */}
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                    <Calendar className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Schedule Report</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Report</DialogTitle>
                <DialogDescription>Set up automated report generation and delivery.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    placeholder="e.g., Monthly Yield Report"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select defaultValue="comprehensive">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                      <SelectItem value="yield">Yield Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="forecast">Forecast Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <RadioGroup value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quarterly" id="quarterly" />
                      <Label htmlFor="quarterly">Quarterly</Label>
                    </div>
                  </RadioGroup>
                </div>

                {scheduleFrequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="weekday">Day of Week</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {scheduleFrequency === "monthly" && (
                  <div className="space-y-2">
                    <Label htmlFor="monthday">Day of Month</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery Method</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="emailDelivery" defaultChecked />
                    <Label htmlFor="emailDelivery" className="font-normal">
                      Email
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Report Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSchedule}>Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  )
}
