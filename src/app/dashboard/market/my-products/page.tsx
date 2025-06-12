"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Product = {
  id: number
  name: string
  price: number
  unit: string
  quantity: number
  image: string
  status: string
  description: string
  sales: number
  views: number
}

export default function MyProductsPage() {
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [soldOutProducts, setSoldOutProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    unit: "kg",
    quantity: 0,
    image: "/placeholder.svg?height=400&width=400",
    status: "active",
    description: "",
    sales: 0,
    views: 0,
  })

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setNotification({
          type: "error",
          message: "You must be logged in to view products",
        })
        return
      }

      // Log the request for debugging
      console.log("Fetching products with token:", token ? "Token exists" : "No token")

      // Use the full API URL
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("API Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Products data received:", data)

      if (data.success) {
        // Separate active and sold out products
        const active = data.products.filter((p: Product) => p.status === "active")
        const soldOut = data.products.filter((p: Product) => p.status === "sold out")

        setActiveProducts(active)
        setSoldOutProducts(soldOut)

        // Show success notification
        setNotification({
          type: "success",
          message: `Successfully loaded ${data.products.length} products`,
        })
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to fetch products",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to fetch products. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (product: Product) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setNotification({
          type: "error",
          message: "You must be logged in to delete products",
        })
        return
      }

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      const data = await response.json()

      if (data.success) {
        // Update local state
        if (product.status === "active") {
          setActiveProducts(activeProducts.filter((p) => p.id !== product.id))
        } else if (product.status === "sold out") {
          setSoldOutProducts(soldOutProducts.filter((p) => p.id !== product.id))
        }

        setNotification({
          type: "success",
          message: "Product deleted successfully",
        })
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to delete product",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      setNotification({
        type: "error",
        message: "Failed to delete product. Please try again later.",
      })
    } finally {
      setDeleteProduct(null)
    }
  }

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setNotification({
          type: "error",
          message: "You must be logged in to add products",
        })
        return
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          unit: newProduct.unit,
          quantity: newProduct.quantity,
          image: newProduct.image,
          description: newProduct.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const data = await response.json()

      if (data.success) {
        // Add to appropriate list based on status
        if (data.product.status === "active") {
          setActiveProducts([...activeProducts, data.product])
        } else {
          setSoldOutProducts([...soldOutProducts, data.product])
        }

        setNotification({
          type: "success",
          message: "Product added successfully",
        })

        // Reset form and close dialog
        setNewProduct({
          name: "",
          price: 0,
          unit: "kg",
          quantity: 0,
          image: "/placeholder.svg?height=400&width=400",
          status: "active",
          description: "",
          sales: 0,
          views: 0,
        })
        setShowAddProduct(false)
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to add product",
        })
      }
    } catch (error) {
      console.error("Error adding product:", error)
      setNotification({
        type: "error",
        message: "Failed to add product. Please try again later.",
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editProduct) return

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setNotification({
          type: "error",
          message: "You must be logged in to update products",
        })
        return
      }

      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editProduct.name,
          price: editProduct.price,
          unit: editProduct.unit,
          quantity: editProduct.quantity,
          image: editProduct.image,
          description: editProduct.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      const data = await response.json()

      if (data.success) {
        // Update local state
        const updatedProduct = data.product

        // Remove from old list
        if (updatedProduct.status === "active") {
          setSoldOutProducts(soldOutProducts.filter((p) => p.id !== updatedProduct.id))
          setActiveProducts([...activeProducts.filter((p) => p.id !== updatedProduct.id), updatedProduct])
        } else {
          setActiveProducts(activeProducts.filter((p) => p.id !== updatedProduct.id))
          setSoldOutProducts([...soldOutProducts.filter((p) => p.id !== updatedProduct.id), updatedProduct])
        }

        setNotification({
          type: "success",
          message: "Product updated successfully",
        })

        setEditProduct(null)
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to update product",
        })
      }
    } catch (error) {
      console.error("Error updating product:", error)
      setNotification({
        type: "error",
        message: "Failed to update product. Please try again later.",
      })
    }
  }

  const handleImageUpload = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Reset status
    setUploadStatus({ type: null, message: "" })

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      setUploadStatus({
        type: "error",
        message: "Please upload only image files (JPEG, PNG, GIF, etc.)",
      })
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "Please upload an image smaller than 5MB",
      })
      return
    }

    setIsUploading(true)

    // Create a URL for the image
    const imageUrl = URL.createObjectURL(file)

    // In a real app, you would upload the file to a server here
    // For this example, we'll just use the local URL
    setTimeout(() => {
      if (editProduct) {
        setEditProduct({ ...editProduct, image: imageUrl })
      } else {
        setNewProduct({ ...newProduct, image: imageUrl })
      }
      setIsUploading(false)
      setUploadStatus({
        type: "success",
        message: "Image uploaded successfully",
      })
    }, 1000) // Simulate upload delay
  }

  // Filter products based on search term
  const filteredActiveProducts = activeProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSoldOutProducts = soldOutProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {notification.type && (
        <div
          className={`p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          } flex items-center justify-between`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setNotification({ type: null, message: "" })}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}
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
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
          <TabsTrigger value="sold-out">Sold Out ({soldOutProducts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts (0)</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading products...</span>
          </div>
        ) : (
          <>
            <TabsContent value="active" className="space-y-4">
              {filteredActiveProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredActiveProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                      <div className="aspect-square relative overflow-hidden">
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
                      <CardContent className="flex-grow">
                        <div className="space-y-3">
                          <p className="text-lg font-bold">
                            LSL {product.price.toFixed(2)} <span className="text-sm font-normal">/ {product.unit}</span>
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 pb-1">{product.description}</p>
                          <div className="flex justify-between mt-2 border-t pt-2">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">{product.sales} sold</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium">{product.views} views</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-green-50 hover:text-green-600"
                                onClick={() => setViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-600"
                                onClick={() => setDeleteProduct(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Plus className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No active products found</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    {searchTerm
                      ? "No products match your search criteria."
                      : "You don't have any active products. Add a new product to get started."}
                  </p>
                  <Button className="mt-4" onClick={() => setShowAddProduct(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold-out" className="space-y-4">
              {filteredSoldOutProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSoldOutProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                      <div className="aspect-square relative overflow-hidden">
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
                      <CardContent className="flex-grow">
                        <div className="space-y-3">
                          <p className="text-lg font-bold">
                            LSL {product.price.toFixed(2)} <span className="text-sm font-normal">/ {product.unit}</span>
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 pb-1">{product.description}</p>
                          <div className="flex justify-between mt-2 border-t pt-2">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">{product.sales} sold</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium">{product.views} views</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-green-50 hover:text-green-600"
                                onClick={() => setViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-600"
                                onClick={() => setDeleteProduct(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Trash2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No sold out products found</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    {searchTerm ? "No products match your search criteria." : "You don't have any sold out products."}
                  </p>
                </div>
              )}
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
                <Button className="mt-4" onClick={() => setShowAddProduct(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Product
                </Button>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* View Product Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Product Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-md">
                <img
                  src={viewProduct.image || "/placeholder.svg"}
                  alt={viewProduct.name}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className={`absolute top-2 right-2 ${viewProduct.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                >
                  {viewProduct.status === "active" ? "Active" : "Sold Out"}
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold">{viewProduct.name}</h3>
                <p className="text-muted-foreground">
                  {viewProduct.quantity} {viewProduct.unit} available
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>
                    LSL {viewProduct.price.toFixed(2)} / {viewProduct.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sales:</span>
                  <span>{viewProduct.sales} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Views:</span>
                  <span>{viewProduct.views}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Description:</h4>
                <p className="text-sm text-muted-foreground">{viewProduct.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Edit Product</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-name">Name</Label>
                <Input
                  id="product-name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-price">Price (LSL/{editProduct.unit})</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number.parseFloat(e.target.value) })}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-quantity">Quantity</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) => setEditProduct({ ...editProduct, quantity: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-md w-20 h-20 flex items-center justify-center overflow-hidden bg-muted">
                    {editProduct.image ? (
                      <img
                        src={editProduct.image || "/placeholder.svg"}
                        alt="Product preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="image-upload-edit"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" size="sm" onClick={handleImageUpload} disabled={isUploading}>
                      {isUploading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Change Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  className="min-h-[80px]"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpdateProduct}
              disabled={!editProduct?.name || !editProduct?.description || (editProduct?.price ?? 0) <= 0}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Add New Product</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="new-product-name">Name*</Label>
              <Input
                id="new-product-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="new-product-price">Price*</Label>
                <Input
                  id="new-product-price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="new-product-unit">Unit*</Label>
                <Select
                  value={newProduct.unit}
                  onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                >
                  <SelectTrigger id="new-product-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="new-product-quantity">Quantity*</Label>
              <Input
                id="new-product-quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="new-product-image">Product Image*</Label>
              <div className="flex items-center gap-4">
                <div className="border rounded-md w-20 h-20 flex items-center justify-center overflow-hidden bg-muted">
                  {newProduct.image && newProduct.image !== "/placeholder.svg?height=400&width=400" ? (
                    <img
                      src={newProduct.image || "/placeholder.svg"}
                      alt="Product preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={handleImageUpload} disabled={isUploading}>
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Only image files (JPG, PNG, GIF) up to 5MB</p>

                  {uploadStatus.type && (
                    <div
                      className={`flex items-center mt-2 text-sm ${uploadStatus.type === "error" ? "text-red-500" : "text-green-500"}`}
                    >
                      {uploadStatus.type === "error" ? (
                        <AlertCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      {uploadStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="new-product-description">Description*</Label>
              <Textarea
                id="new-product-description"
                className="min-h-[100px] resize-none"
                placeholder="Enter a detailed description of your product..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                A good description helps customers understand your product better.
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleAddProduct}
              disabled={
                !newProduct.name ||
                !newProduct.description ||
                (newProduct.price ?? 0) <= 0 ||
                (newProduct.quantity ?? 0) < 0 ||
                newProduct.image === "/placeholder.svg?height=400&width=400"
              }
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your product
            {deleteProduct && <span className="font-medium"> "{deleteProduct.name}"</span>} from our servers.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteProduct && handleDelete(deleteProduct)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
