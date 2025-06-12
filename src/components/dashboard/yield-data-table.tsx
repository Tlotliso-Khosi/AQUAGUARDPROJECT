"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FieldData {
  id: number
  field_id: number
  field_name: string
  crop_type: string
  yield_amount: number
  unit: string
  measurement_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export function YieldDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<FieldData[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    if (typeof updater === "function") {
      const newState = updater(pagination)
      if (newState && typeof newState === "object") {
        setPageIndex(Number(newState.pageIndex))
        setPageSize(Number(newState.pageSize))
      }
    } else if (updater && typeof updater === "object") {
      setPageIndex(Number(updater.pageIndex))
      setPageSize(Number(updater.pageSize))
    }
  }

  const columns: ColumnDef<FieldData>[] = [
    {
      accessorKey: "field_name",
      header: "Field",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("field_name")}</div>
      },
    },
    {
      accessorKey: "crop_type",
      header: "Crop Type",
      cell: ({ row }) => {
        const cropType = row.getValue("crop_type") as string
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
            {cropType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "yield_amount",
      header: "Yield Amount",
      cell: ({ row }) => {
        const amount = row.getValue("yield_amount") as number
        const unit = row.getValue("unit") as string
        return <div className="font-medium">{`${amount} ${unit}`}</div>
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      enableHiding: true,
    },
    {
      accessorKey: "measurement_date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("measurement_date") as string
        return <div>{new Date(date).toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string | null
        return notes ? (
          <div className="max-w-[200px] truncate">{notes}</div>
        ) : (
          <div className="text-muted-foreground italic">No notes</div>
        )
      },
    },
  ]

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching field data from:", "http://localhost:5000/api/field-data")

      const response = await fetch("http://localhost:5000/api/field-data", {
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

      const result = await response.json()
      console.log("Field data fetched:", result)
      setData(result.fieldData || [])
    } catch (error) {
      console.error("Error fetching field data:", error)
      setError(`Error fetching field data: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Listen for refresh events
    const handleRefresh = () => {
      fetchData()
    }

    window.addEventListener("refresh-field-data", handleRefresh)

    return () => {
      window.removeEventListener("refresh-field-data", handleRefresh)
    }
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onPaginationChange: handlePaginationChange,
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Yield Data</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={`${pageSize}`} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground">
                        {globalFilter
                          ? "No results found for your search."
                          : "No yield data available. Add your first data entry using the + button."}
                      </p>
                      {globalFilter && (
                        <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} row(s) total
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
