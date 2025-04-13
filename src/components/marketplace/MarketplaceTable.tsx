"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table"
import { Badge } from "@src/components/ui/badge"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui/select"
import { Card } from "@src/components/ui/card"
import { Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@src/components/ui/pagination"
import { useToast } from "@src/hooks/use-toast"

interface Product {
  id: string
  name: string
  category: string
  creator: {
    id: string
    name: string
  }
  tags: string[]
  statistics: {
    views: number
    sales: number
  }
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Python Basics",
    category: "Courses",
    creator: {
      id: "c1",
      name: "John Smith",
    },
    tags: ["Featured", "Trending"],
    statistics: {
      views: 2000,
      sales: 150,
    },
  },
  {
    id: "2",
    name: "Digital Marketing",
    category: "Workshops",
    creator: {
      id: "c2",
      name: "Jane Doe",
    },
    tags: ["Best Deal", "Popular"],
    statistics: {
      views: 5000,
      sales: 300,
    },
  },
  {
    id: "3",
    name: "New Product",
    category: "Courses",
    creator: {
      id: "c3",
      name: "Jane Doe",
    },
    tags: ["New", "Trending", "Featured"],
    statistics: {
      views: 5000,
      sales: 300,
    },
  },

]

const ITEMS_PER_PAGE = 5
const AVAILABLE_TAGS = ["Featured", "Trending", "Best Deal", "Popular", "New"]

export function MarketplaceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const handleAddTag = (productId: string, newTag: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product && !product.tags.includes(newTag)) {
      product.tags.push(newTag)
      toast({
        description: `Added tag "${newTag}" to "${product.name}"`,
      })
    }
  }

  const handleRemoveTag = (productId: string, tagToRemove: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product) {
      product.tags = product.tags.filter((tag) => tag !== tagToRemove)
      toast({
        description: `Removed tag "${tagToRemove}" from "${product.name}"`,
      })
    }
  }

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesTab = activeTab === "all" || product.tags.includes(activeTab)
    return matchesSearch && matchesCategory && matchesTab
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList style={{ backgroundColor: "#FFF" }}>
          <TabsTrigger value="all">All Products</TabsTrigger>
          {/* <TabsTrigger value="Trending">Trending</TabsTrigger>
          <TabsTrigger value="Best Deal">Highest Value</TabsTrigger>
          <TabsTrigger value="New">New</TabsTrigger> */}
        </TabsList>

        <TabsContent value="all">
          <Card className="p-4 mb-4" style={{ backgroundColor: "#fff" }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#fff" }}>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="rounded-md border" style={{ backgroundColor: "#fff" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Current Tags</TableHead>
                  <TableHead>Key Statistics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {product.creator.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(product.id, tag)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm" style={{display: "none"}}>Views: {product.statistics.views.toLocaleString()}</div>
                        <div className="text-sm">Sales: {product.statistics.sales.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                      value = ""
                        onValueChange={(value: string) => handleAddTag(product.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Add tag..." />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: "#FFF" }}>
                          {AVAILABLE_TAGS.filter(tag => !product.tags.includes(tag)).map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  className="gap-1 pl-2.5"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    size="sm"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button 
                  variant="ghost"
                  className="gap-1 pr-2.5"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>

        <TabsContent value="Trending">
          <div className="rounded-md border" style={{ backgroundColor: "#fff" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Current Tags</TableHead>
                  <TableHead>Key Statistics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {product.creator.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Views: {product.statistics.views.toLocaleString()}</div>
                        <div className="text-sm">Sales: {product.statistics.sales.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" /> Add Tag
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <X className="h-4 w-4 mr-1" /> Remove Tag
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="Best Deal">
          <div className="rounded-md border" style={{ backgroundColor: "#fff" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Current Tags</TableHead>
                  <TableHead>Key Statistics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {product.creator.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Views: {product.statistics.views.toLocaleString()}</div>
                        <div className="text-sm">Sales: {product.statistics.sales.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" /> Add Tag
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <X className="h-4 w-4 mr-1" /> Remove Tag
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="New">
          <div className="rounded-md border" style={{ backgroundColor: "#fff" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Current Tags</TableHead>
                  <TableHead>Key Statistics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {product.creator.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Views: {product.statistics.views.toLocaleString()}</div>
                        <div className="text-sm">Sales: {product.statistics.sales.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" /> Add Tag
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <X className="h-4 w-4 mr-1" /> Remove Tag
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
