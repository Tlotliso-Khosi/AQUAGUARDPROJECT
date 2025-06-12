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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Sale {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  customer: string;
}

const sales: Sale[] = [
  {
    id: "1",
    product: "Fresh Tomatoes",
    quantity: 5,
    price: 2.99,
    total: 14.95,
    date: "2024-03-15",
    status: "completed",
    customer: "Ts'epo Mosala",
  },
  {
    id: "2",
    product: "Organic Lettuce",
    quantity: 3,
    price: 3.49,
    total: 10.47,
    date: "2024-03-15",
    status: "completed",
    customer: "Katleho Mosotho",
  },
  {
    id: "3",
    product: "Carrots",
    quantity: 2,
    price: 1.99,
    total: 3.98,
    date: "2024-03-14",
    status: "cancelled",
    customer: "Thabo Mosala",
  },
  {
    id: "4",
    product: "Green Beans",
    quantity: 4,
    price: 2.49,
    total: 9.96,
    date: "2024-03-14",
    status: "pending",
    customer: "Palesa Thamae",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

// Sample data for the chart
const chartData = [
  { date: "2024-03-10", sales: 1200 },
  { date: "2024-03-11", sales: 1500 },
  { date: "2024-03-12", sales: 1800 },
  { date: "2024-03-13", sales: 1400 },
  { date: "2024-03-14", sales: 2000 },
  { date: "2024-03-15", sales: 1600 },
];

export function SalesHistory() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search sales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell className="font-medium">{sale.product}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>M{sale.price.toFixed(2)}</TableCell>
                <TableCell>M{sale.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[sale.status]}
                  >
                    {sale.status}
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