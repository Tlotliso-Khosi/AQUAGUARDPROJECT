import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Heart, Search, ArrowLeft } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/customer/market">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
          <p className="text-muted-foreground">Browse and purchase agricultural products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your product search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="space-y-2">
                {["Vegetables", "Fruits", "Grains", "Dairy", "Meat", "Equipment"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`category-${category.toLowerCase()}`} />
                    <label
                      htmlFor={`category-${category.toLowerCase()}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Price Range</h4>
              <Slider defaultValue={[0, 100]} max={100} step={1} className="py-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm">$0</span>
                <span className="text-sm">$100+</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Seller Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox id={`rating-${rating}`} />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {rating}+ Stars
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Availability</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="in-stock" defaultChecked />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="local-pickup" />
                  <label
                    htmlFor="local-pickup"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Local Pickup
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="delivery" />
                  <label
                    htmlFor="delivery"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Delivery Available
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8" />
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">Showing 12 of 120 products</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              {
                id: 7,
                name: "Irrigation System",
                price: 299.99,
                unit: "set",
                seller: "AgroTech",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.8,
                inStock: true,
              },
              {
                id: 8,
                name: "Organic Fertilizer",
                price: 24.99,
                unit: "5kg bag",
                seller: "EcoGrow",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.6,
                inStock: true,
              },
              {
                id: 9,
                name: "Garden Tools Set",
                price: 49.99,
                unit: "set",
                seller: "Farm Essentials",
                image: "/placeholder.svg?height=200&width=200",
                rating: 4.4,
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

          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
