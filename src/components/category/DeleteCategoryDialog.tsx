
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@src/components/ui/dialog";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemToDelete: string | null;
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteCategoryDialog = ({
  isOpen,
  onOpenChange,
  itemToDelete,
  deleteConfirmText,
  setDeleteConfirmText,
  onConfirm,
  onCancel,
}: DeleteCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent  className="bg-white" >
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Are you sure you want to delete <span className="font-bold"> {`"${itemToDelete}"`}</span> ? This action cannot be undone.</p>
          
          <div className="grid gap-2">
            <Label htmlFor="confirm">Type DELETE to confirm:</Label>
            <Input
              id="confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={deleteConfirmText !== 'DELETE'}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
