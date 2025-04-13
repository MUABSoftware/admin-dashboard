"use client"
import { useState, useEffect } from "react"
import { Button } from "@src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog"
import { Input } from "@src/components/ui/input"
import { Label } from "@src/components/ui/label"

interface Category {
  name: string
  totalPosts: number
  totalDigitalProducts: number
  totalBusinessSpaces: number
  subCategories: string[]
  topics: string[]
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (category: Category) => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState<Category>({
    name: "",
    totalPosts: 0,
    totalDigitalProducts: 0,
    totalBusinessSpaces: 0,
    subCategories: [],
    topics: [],
  })

  useEffect(() => {
    if (category) {
      setFormData(category)
    } else {
      setFormData({
        name: "",
        totalPosts: 0,
        totalDigitalProducts: 0,
        totalBusinessSpaces: 0,
        subCategories: [],
        topics: [],
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCategories">Sub-Categories (comma-separated)</Label>
            <Input
              id="subCategories"
              value={formData.subCategories.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subCategories: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topics">Topics (comma-separated)</Label>
            <Input
              id="topics"
              value={formData.topics.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  topics: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit"
              variant="outline">
              {category ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}