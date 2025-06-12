"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastRestocked: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

const inventory: InventoryItem[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    currentStock: 150,
    minimumStock: 50,
    unit: "kg",
    lastRestocked: "2024-03-15",
    status: "in_stock",
  },
  {
    id: "2",
    name: "Organic Lettuce",
    category: "Vegetables",
    currentStock: 75,
    minimumStock: 30,
    unit: "units",
    lastRestocked: "2024-03-15",
    status: "in_stock",
  },
  {
    id: "3",
    name: "Carrots",
    category: "Vegetables",
    currentStock: 15,
    minimumStock: 40,
    unit: "kg",
    lastRestocked: "2024-03-14",
    status: "low_stock",
  },
  {
    id: "4",
    name: "Green Beans",
    category: "Vegetables",
    currentStock: 0,
    minimumStock: 25,
    unit: "kg",
    lastRestocked: "2024-03-10",
    status: "out_of_stock",
  },
];

const statusColors = {
  in_stock: "bg-green-100 text-green-800",
  low_stock: "bg-yellow-100 text-yellow-800",
  out_of_stock: "bg-red-100 text-red-800",
};

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter(
    (item) => item.status === "low_stock" || item.status === "out_of_stock"
  );

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} item{lowStockItems.length === 1 ? "" : "s"} need{lowStockItems.length === 1 ? "s" : ""} to be restocked.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter((item) => item.status === "out_of_stock").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate action needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Restocked</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(Math.max(...inventory.map(item => new Date(item.lastRestocked).getTime()))).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent restock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.minimumStock}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.lastRestocked}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[item.status]}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 