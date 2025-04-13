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
import { Input } from "@src/components/ui/input"
import { useState } from "react"
import { Checkbox } from "@src/components/ui/checkbox"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemType: "sub-category" | "topic"
  onConfirm: () => void
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  itemName,
  itemType,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [deleteText, setDeleteText] = useState("")
  const [isChecked, setIsChecked] = useState(false)

  const isValid = deleteText === "DELETE" || isChecked

  const handleConfirm = () => {
    if (isValid) {
      onConfirm()
      onOpenChange(false)
      setDeleteText("")
      setIsChecked(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemType}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the {itemType} &quot;{itemName}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type DELETE to confirm:
            </p>
            <Input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type DELETE"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand this action cannot be undone
            </label>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}