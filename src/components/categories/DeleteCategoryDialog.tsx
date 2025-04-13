"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
  totalPosts: number
  totalDigitalProducts: number
  totalBusinessSpaces: number
  subCategories: string[]
  topics: string[]
} 

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: (category: Category) => void
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!category) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[500px] bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-destructive">
            Confirm Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-base font-medium text-foreground">
              Deleting the category &quot;{category.name}&quot; will permanently
              remove it from the system.
            </p>
            <div className="space-y-2">
              <p className="font-medium">
                This category is linked to the following objects:
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">{category.totalPosts}</span> Posts
                </li>
                <li>
                  <span className="font-medium">
                    {category.totalDigitalProducts}
                  </span>{" "}
                  Digital Products
                </li>
                <li>
                  <span className="font-medium">
                    {category.totalBusinessSpaces}
                  </span>{" "}
                  Business Spaces
                </li>
                <li>
                  <span className="font-medium">
                    {category.subCategories.length}
                  </span>{" "}
                  Sub-Categories
                </li>
                <li>
                  <span className="font-medium">{category.topics.length}</span>{" "}
                  Topics
                </li>
              </ul>
            </div>
            <div className="rounded-md bg-muted p-4">
              <p className="font-medium text-muted-foreground">
                All linked objects will be reassigned to &quot;Uncategorized&quot;
                or equivalent default values.
              </p>
            </div>
            <p className="font-semibold text-destructive">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(category)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/50 border"
          >
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}