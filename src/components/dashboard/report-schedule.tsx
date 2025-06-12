"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Bell } from "lucide-react"

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Yield Report",
    frequency: "Weekly",
    lastRun: "2024-03-15",
    nextRun: "2024-03-22",
    status: "active",
    recipients: 3,
  },
  {
    id: 2,
    name: "Monthly Performance Analysis",
    frequency: "Monthly",
    lastRun: "2024-03-01",
    nextRun: "2024-04-01",
    status: "active",
    recipients: 5,
  },
  {
    id: 3,
    name: "Quarterly Forecast",
    frequency: "Quarterly",
    lastRun: "2024-01-01",
    nextRun: "2024-04-01",
    status: "paused",
    recipients: 2,
  },
]

export function ReportSchedule() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scheduled Reports</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Next Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.name}</TableCell>
              <TableCell>{report.frequency}</TableCell>
              <TableCell>{report.lastRun}</TableCell>
              <TableCell>{report.nextRun}</TableCell>
              <TableCell>
                <Badge
                  variant={report.status === "active" ? "default" : "secondary"}
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  {report.recipients}
                </div>
              </TableCell>
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
  )
} 