import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">View and analyze your market activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$350</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="purchases">Purchase Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Your product sales performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Your most recent product sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    product: "Premium Maize",
                    quantity: 50,
                    price: 2.99,
                    total: 149.5,
                    date: "2023-04-15",
                    status: "completed",
                  },
                  {
                    id: 2,
                    product: "Fresh Beans",
                    quantity: 30,
                    price: 4.49,
                    total: 134.7,
                    date: "2023-04-12",
                    status: "completed",
                  },
                  {
                    id: 3,
                    product: "Organic Cassava",
                    quantity: 100,
                    price: 3.29,
                    total: 329,
                    date: "2023-04-10",
                    status: "completed",
                  },
                  {
                    id: 4,
                    product: "Premium Maize",
                    quantity: 200,
                    price: 2.99,
                    total: 598,
                    date: "2023-04-05",
                    status: "completed",
                  },
                ].map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} units at ${sale.price}/unit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${sale.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{sale.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        sale.status === "completed"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Overview</CardTitle>
              <CardDescription>Your product purchase history</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
              <CardDescription>Your most recent product purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    product: "Organic Tomatoes",
                    quantity: 5,
                    price: 4.99,
                    total: 24.95,
                    date: "2023-04-16",
                    status: "delivered",
                  },
                  {
                    id: 2,
                    product: "Fresh Lettuce",
                    quantity: 3,
                    price: 3.49,
                    total: 10.47,
                    date: "2023-04-16",
                    status: "delivered",
                  },
                  {
                    id: 3,
                    product: "Irrigation System",
                    quantity: 1,
                    price: 299.99,
                    total: 299.99,
                    date: "2023-04-10",
                    status: "shipped",
                  },
                  {
                    id: 4,
                    product: "Organic Fertilizer",
                    quantity: 2,
                    price: 24.99,
                    total: 49.98,
                    date: "2023-04-05",
                    status: "delivered",
                  },
                ].map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{purchase.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.quantity} units at ${purchase.price}/unit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${purchase.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{purchase.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        purchase.status === "delivered"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {purchase.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Overview of your financial performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "April", revenue: 1200 },
                    { month: "March", revenue: 980 },
                    { month: "February", revenue: 1050 },
                    { month: "January", revenue: 890 },
                  ].map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span>{item.month}</span>
                      <span className="font-medium">${item.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
                <CardDescription>Profit margin by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Grains", margin: 25 },
                    { category: "Vegetables", margin: 30 },
                    { category: "Fruits", margin: 35 },
                    { category: "Roots & Tubers", margin: 20 },
                  ].map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.margin}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.margin * 2}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
