import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react"

export default function MyProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/customer/market">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Products</h2>
          <p className="text-muted-foreground">Manage your products in the marketplace</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active (2)</TabsTrigger>
          <TabsTrigger value="sold-out">Sold Out (1)</TabsTrigger>
          <TabsTrigger value="drafts">Drafts (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                id: 101,
                name: "Premium Maize",
                price: 2.99,
                unit: "kg",
                quantity: 500,
                image: "/placeholder.svg?height=200&width=200",
                status: "active",
                description: "High-quality maize grown using organic farming practices",
                sales: 120,
                views: 450,
              },
              {
                id: 102,
                name: "Fresh Beans",
                price: 4.49,
                unit: "kg",
                quantity: 200,
                image: "/placeholder.svg?height=200&width=200",
                status: "active",
                description: "Freshly harvested beans, perfect for soups and stews",
                sales: 85,
                views: 320,
              },
            ].map((product) => (
              <Card key={product.id}>
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Active</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {product.quantity} {product.unit} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-bold">
                      ${product.price} <span className="text-sm font-normal">/ {product.unit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{product.sales} sold</span>
                      <span>{product.views} views</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sold-out" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                id: 103,
                name: "Organic Cassava",
                price: 3.29,
                unit: "kg",
                quantity: 0,
                image: "/placeholder.svg?height=200&width=200",
                status: "sold out",
                description: "Organically grown cassava, freshly harvested",
                sales: 200,
                views: 580,
              },
            ].map((product) => (
              <Card key={product.id}>
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">Sold Out</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {product.quantity} {product.unit} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-bold">
                      ${product.price} <span className="text-sm font-normal">/ {product.unit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{product.sales} sold</span>
                      <span>{product.views} views</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Edit className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No draft products</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You don't have any draft products. Create a new product and save it as a draft to see it here.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New Product
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
