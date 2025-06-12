"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function DataImportHistory() {
  // Sample import history
  const importHistory = [
    {
      id: 1,
      filename: "yield_data_2023.csv",
      date: "2023-05-15T10:30:00Z",
      records: 156,
      status: "success",
      user: "admin@example.com",
    },
    {
      id: 2,
      filename: "field_measurements_q1.xlsx",
      date: "2023-04-02T14:15:00Z",
      records: 87,
      status: "success",
      user: "admin@example.com",
    },
    {
      id: 3,
      filename: "sensor_data_march.csv",
      date: "2023-03-28T09:45:00Z",
      records: 243,
      status: "partial",
      user: "admin@example.com",
    },
    {
      id: 4,
      filename: "crop_yields_2022.xlsx",
      date: "2023-02-10T16:20:00Z",
      records: 112,
      status: "failed",
      user: "admin@example.com",
    },
  ]

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Success</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Partial</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {importHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.filename}</TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>{item.records}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{item.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
