import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MarketPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market</h2>
          <p className="text-muted-foreground">Browse and manage agricultural products</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Link href="/customer/market/cart">
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart (2)
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-products">My Products</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Product Cards */}
            {[
              {
                id: 1,
                name: "Organic Tomatoes",
                price: 4.99,
                unit: "kg",
                seller: "Green Farms",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.5,
                inStock: true,
              },
              {
                id: 2,
                name: "Fresh Lettuce",
                price: 3.49,
                unit: "kg",
                seller: "Organic Gardens",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.2,
                inStock: true,
              },
              {
                id: 3,
                name: "Sweet Corn",
                price: 2.99,
                unit: "dozen",
                seller: "Harvest Fields",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.7,
                inStock: true,
              },
              {
                id: 4,
                name: "Red Potatoes",
                price: 5.99,
                unit: "5kg bag",
                seller: "Root Crops Co.",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.0,
                inStock: false,
              },
              {
                id: 5,
                name: "Organic Carrots",
                price: 3.29,
                unit: "kg",
                seller: "Veggie Paradise",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.3,
                inStock: true,
              },
              {
                id: 6,
                name: "Fresh Spinach",
                price: 2.49,
                unit: "bunch",
                seller: "Green Leaves",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.1,
                inStock: true,
              },
            ].map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm font-medium">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.seller}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      ${product.price} <span className="text-sm font-normal">/ {product.unit}</span>
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">My Listed Products</h3>
            <Button>
              <span className="mr-2">+</span> Add New Product
            </Button>
          </div>
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
              },
              {
                id: 102,
                name: "Fresh Beans",
                price: 4.49,
                unit: "kg",
                quantity: 200,
                image: "/placeholder.svg?height=200&width=200",
                status: "active",
              },
              {
                id: 103,
                name: "Organic Cassava",
                price: 3.29,
                unit: "kg",
                quantity: 0,
                image: "/placeholder.svg?height=200&width=200",
                status: "sold out",
              },
            ].map((product) => (
              <Card key={product.id}>
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${product.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {product.status === "active" ? "Active" : "Sold Out"}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {product.quantity > 0 ? `${product.quantity} ${product.unit} available` : "Out of stock"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">
                    ${product.price} <span className="text-sm font-normal">/ {product.unit}</span>
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive">Remove</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                id: 201,
                name: "Irrigation System",
                price: 299.99,
                seller: "AgroTech",
                image: "/placeholder.svg?height=200&width=200",
                savedDate: "2023-04-15",
              },
              {
                id: 202,
                name: "Organic Fertilizer",
                price: 24.99,
                seller: "EcoGrow",
                image: "/placeholder.svg?height=200&width=200",
                savedDate: "2023-04-10",
              },
            ].map((product) => (
              <Card key={product.id}>
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.seller}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">${product.price}</p>
                    <p className="text-sm text-muted-foreground">Saved on {product.savedDate}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
