"use client"
import { Button } from "@src/components/ui/button"
import { Badge } from "@src/components/ui/badge"
import { X } from "lucide-react"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion"
import { useState } from "react"
import { DeleteConfirmationDialog } from "@src/components/categories/DeleteConfirmationDialog"

interface SubCategoryItemProps {
  name: string
  topics: string[]
  onRemoveSubCategory: (name: string) => void
  onRemoveTopic: (subCategoryName: string, topic: string) => void
}

export function SubCategoryItem({
  name,
  topics,
  onRemoveSubCategory,
  onRemoveTopic,
}: SubCategoryItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null)

  return (
    <>
      <AccordionItem value={name}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <span>{name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pl-4 space-y-2">
            {topics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {topic}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => {
                    setTopicToDelete(topic)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={name}
        itemType="sub-category"
        onConfirm={() => onRemoveSubCategory(name)}
      />

      <DeleteConfirmationDialog
        open={!!topicToDelete}
        onOpenChange={() => setTopicToDelete(null)}
        itemName={topicToDelete || ""}
        itemType="topic"
        onConfirm={() => {
          if (topicToDelete) {
            onRemoveTopic(name, topicToDelete)
          }
        }}
      />
    </>
  )
}