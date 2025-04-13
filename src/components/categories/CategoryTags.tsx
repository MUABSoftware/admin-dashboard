"use client"
import { useState } from "react"
import { useToast } from "@src/hooks/use-toast"

interface CategoryTagsProps {
  categoryId?: string
}

export function CategoryTags({ 
  //categoryId 
  }: CategoryTagsProps) {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()

  const addTag = () => {
    const trimmedValue = newTag.trim()
    if (!trimmedValue) {
      toast({
        title: "Error",
        description: "Please enter a valid tag",
        variant: "destructive",
      })
      return
    }

    if (tags.includes(trimmedValue)) {
      toast({
        title: "Error",
        description: "This tag already exists",
        variant: "destructive",
      })
      return
    }

    setTags([...tags, trimmedValue])
    setNewTag("")
    toast({
      title: "Success",
      description: "Tag added successfully",
    })
  }

  const deleteTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
    toast({
      title: "Success",
      description: "Tag removed successfully",
    })
  }

  return (
    <div className="space-y-6 bg-background w-full">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Tags for your business</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="border rounded p-2"
          />
          <button onClick={addTag} className="bg-blue-500 text-white rounded p-2">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-full border border-transparent hover:bg-white hover:text-black hover:border hover:border-gray-300 transition">
              <span>#</span> {tag}
              <button
                className="ml-1 hover:text-black"
                onClick={() => deleteTag(tag)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}