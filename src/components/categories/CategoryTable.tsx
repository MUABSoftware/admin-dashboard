"use client"
import { useState } from "react"
import { Plus, Edit, Trash, Check } from "lucide-react"
import { Button } from "@src/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table"
import { CategoryDialog } from "@src/components/categories/CategoryDialog"
import { DeleteCategoryDialog } from "@src/components/categories/DeleteCategoryDialog"
import { useToast } from "@src/hooks/use-toast"
import Link from "next/link"

interface Category {
  id: string
  name: string
  totalPosts: number
  totalDigitalProducts: number
  totalBusinessSpaces: number
  subCategories: string[]
  topics: string[]
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Business",
    totalPosts: 120,
    totalDigitalProducts: 25,
    totalBusinessSpaces: 10,
    subCategories: ["Entrepreneurship", "Marketing"],
    topics: ["Startup Tips", "Growth Hacks"],
  },
  {
    id: "2",
    name: "Business",
    totalPosts: 120,
    totalDigitalProducts: 25,
    totalBusinessSpaces: 10,
    subCategories: ["Entrepreneurship", "Marketing"],
    topics: ["Startup Tips", "Growth Hacks"],
  },
  {
    id: "3",
    name: "Business",
    totalPosts: 120,
    totalDigitalProducts: 25,
    totalBusinessSpaces: 10,
    subCategories: ["Entrepreneurship", "Marketing"],
    topics: ["Startup Tips", "Growth Hacks"],
  },
  {
    id: "5",
    name: "Business",
    totalPosts: 120,
    totalDigitalProducts: 25,
    totalBusinessSpaces: 10,
    subCategories: ["Entrepreneurship", "Marketing"],
    topics: ["Startup Tips", "Growth Hacks"],
  },
]

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const { toast } = useToast()

  const handleAdd = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(7),
    }
    setCategories([...categories, newCategory])
    toast({
      title: "Category added",
      description: `${category.name} has been added successfully.`,
    })
  }

  const handleEdit = (category: Category) => {
    setCategories(
      categories.map((c) => (c.id === category.id ? category : c))
    )
    toast({
      title: "Category updated",
      description: `${category.name} has been updated successfully.`,
    })
  }

  const handleDelete = (category: Category) => {
    setCategories(categories.filter((c) => c.id !== category.id))
    toast({
      title: "Success",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>The category &quot;{category.name}&quot; has been successfully deleted.</span>
        </div>
      ),
      duration: 5000, // 5 seconds
    })
    setCategoryToDelete(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2" />
          Add New Category
        </Button>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className="text-right">Total Posts</TableHead>
              <TableHead className="text-right">Total Digital Products</TableHead>
              <TableHead className="text-right">Total Business Spaces</TableHead>
              <TableHead>Related Sub-Categories</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Link
                    href={`/categories/category-detail?id=${category.id}`}
                    className="text-primary hover:underline"
                  >
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{category.totalPosts}</TableCell>
                <TableCell className="text-right">
                  {category.totalDigitalProducts}
                </TableCell>
                <TableCell className="text-right">
                  {category.totalBusinessSpaces}
                </TableCell>
                <TableCell>{category.subCategories.join(", ")}</TableCell>
                <TableCell>{category.topics.join(", ")}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCategory(category)
                      setDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCategoryToDelete(category)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSubmit={(category) => {
          if (selectedCategory) {
            handleEdit({ ...category, id: selectedCategory.id })
          } else {
            handleAdd(category)
          }
          setSelectedCategory(null)
          setDialogOpen(false)
        }}
      />
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={categoryToDelete}
        onConfirm={handleDelete}
      />
    </div>
  )
}