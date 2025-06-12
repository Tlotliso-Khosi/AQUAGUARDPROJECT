"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

// Define product type
type Product = {
  id: number
  name: string
  price: number
  unit: string
  seller: string
  image: string
  rating: number
  inStock: boolean
  category: string
  delivery?: boolean
  localPickup?: boolean
}

export default function MarketplacePage() {
  // All products data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 4.99,
      unit: "kg",
      seller: "Green Farms",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      inStock: true,
      category: "Vegetables",
      delivery: true,
      localPickup: true,
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
      category: "Vegetables",
      delivery: true,
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
      category: "Vegetables",
      localPickup: true,
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
      category: "Vegetables",
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
      category: "Vegetables",
      delivery: true,
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
      category: "Vegetables",
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
      category: "Equipment",
      delivery: true,
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
      category: "Equipment",
      localPickup: true,
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
      category: "Equipment",
    },
    {
      id: 10,
      name: "Fresh Apples",
      price: 3.99,
      unit: "kg",
      seller: "Orchard Fresh",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      inStock: true,
      category: "Fruits",
      delivery: true,
    },
    {
      id: 11,
      name: "Organic Bananas",
      price: 2.49,
      unit: "kg",
      seller: "Tropical Farms",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.3,
      inStock: true,
      category: "Fruits",
    },
    {
      id: 12,
      name: "Whole Milk",
      price: 3.29,
      unit: "liter",
      seller: "Dairy Delights",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      inStock: true,
      category: "Dairy",
      localPickup: true,
    },
    {
      id: 13,
      name: "Organic Rice",
      price: 7.99,
      unit: "5kg bag",
      seller: "Grain Growers",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.2,
      inStock: true,
      category: "Grains",
      delivery: true,
    },
    {
      id: 14,
      name: "Grass-Fed Beef",
      price: 12.99,
      unit: "kg",
      seller: "Pasture Farms",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      inStock: true,
      category: "Meat",
      localPickup: true,
    },
  ]

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [availability, setAvailability] = useState({
    inStock: false,
    localPickup: false,
    delivery: false,
  })

  // Filtered products state
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [filtersApplied, setFiltersApplied] = useState(false)
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Number of products per page

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    setMinRating(minRating === rating ? null : rating)
  }

  // Handle availability filter change
  const handleAvailabilityChange = (key: keyof typeof availability) => {
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Apply filters function
  const applyFilters = () => {
    setFiltersApplied(true)

    // Filter products based on selected filters
    let filtered = [...allProducts]

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by rating
    if (minRating !== null) {
      filtered = filtered.filter((product) => product.rating >= minRating)
    }

    // Filter by availability
    if (availability.inStock) {
      filtered = filtered.filter((product) => product.inStock)
    }

    if (availability.localPickup) {
      filtered = filtered.filter((product) => product.localPickup)
    }

    if (availability.delivery) {
      filtered = filtered.filter((product) => product.delivery)
    }

    setFilteredProducts(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 300])
    setMinRating(null)
    setAvailability({
      inStock: false,
      localPickup: false,
      delivery: false,
    })
    setFiltersApplied(false)
    setFilteredProducts(allProducts)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Apply filters automatically when any filter changes
  useEffect(() => {
    if (filtersApplied) {
      applyFilters()
    }
  }, [selectedCategories, priceRange, minRating, availability, filtersApplied])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredProducts])

  // Calculate paginated products
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

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
        <Card className="md:col-span-1 md:sticky md:top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                    <Checkbox
                      id={`category-${category.toLowerCase()}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
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
              <Slider
                value={priceRange}
                max={300}
                step={1}
                className="py-4"
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">LSL {priceRange[0]}</span>
                <span className="text-sm">LSL {priceRange[1]}+</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Seller Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={minRating === rating}
                      onCheckedChange={() => handleRatingChange(rating)}
                    />
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
                  <Checkbox
                    id="in-stock"
                    checked={availability.inStock}
                    onCheckedChange={() => handleAvailabilityChange("inStock")}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="local-pickup"
                    checked={availability.localPickup}
                    onCheckedChange={() => handleAvailabilityChange("localPickup")}
                  />
                  <label
                    htmlFor="local-pickup"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Local Pickup
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="delivery"
                    checked={availability.delivery}
                    onCheckedChange={() => handleAvailabilityChange("delivery")}
                  />
                  <label
                    htmlFor="delivery"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Delivery Available
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button className="w-full" variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="md:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-lg font-medium mb-2">No products match your filters</p>
              <p className="text-muted-foreground mb-4">Try adjusting your filter criteria</p>
              <Button variant="outline" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
                {filtersApplied && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentProducts.map((product) => (
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
                          LSL {product.price} <span className="text-sm font-normal">/ {product.unit}</span>
                        </p>
                        <div className="flex items-center">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.delivery && <Badge variant="outline">Delivery</Badge>}
                        {product.localPickup && <Badge variant="outline">Local Pickup</Badge>}
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
            </>
          )}

          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
