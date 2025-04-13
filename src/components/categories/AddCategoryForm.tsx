"use client"
import { Plus } from "lucide-react"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select"

interface AddCategoryFormProps {
  newSubCategory: string
  setNewSubCategory: (value: string) => void
  newTopic: string
  setNewTopic: (value: string) => void
  selectedSubCategory: string
  setSelectedSubCategory: (value: string) => void
  subCategories: { name: string; topics: string[] }[]
  onAddSubCategory: () => void
  onAddTopic: () => void
}

export function AddCategoryForm({
  newSubCategory,
  setNewSubCategory,
  newTopic,
  setNewTopic,
  selectedSubCategory,
  setSelectedSubCategory,
  subCategories,
  onAddSubCategory,
  onAddTopic,
}: AddCategoryFormProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Input
          placeholder="Add new sub-category"
          value={newSubCategory}
          onChange={(e) => setNewSubCategory(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onAddSubCategory()
            }
          }}
        />
        <Button onClick={onAddSubCategory} className="mt-2 border">
          <Plus className="mr-2 h-4 w-4" />
          Add Sub-category
        </Button>
      </div>
      <div>
        <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select a sub-category" />
          </SelectTrigger>
          <SelectContent className="bg-[#fff]">
            {subCategories.map((sc) => (
              <SelectItem key={sc.name} value={sc.name}>
                {sc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add new topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAddTopic()
              }
            }}
          />
          <Button onClick={onAddTopic} className="border">
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
      </div>
    </div>
  )
}