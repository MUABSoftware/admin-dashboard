
import { Plus } from 'lucide-react';
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { MenuItem } from '@src/types/navigation';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newCategory: {
    label: string;
    labelAr: string;
    parentId: string;
  };
  setNewCategory: (category: { label: string; labelAr: string; parentId: string }) => void;
  menuData: MenuItem[];
  onAdd: () => void;
}

const AddCategoryDialog = ({
  isOpen,
  onOpenChange,
  newCategory,
  setNewCategory,
  menuData,
  onAdd,
}: AddCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} 
     
    >
      <span className='text-xl font-bold'>Manage Categories</span>
      <DialogTrigger asChild>
        <Button className="w-full bg-dark" style={{backgroundColor: 'black',color: 'white'}}> 
          <Plus className="w-4 h-4 mr-2 " />
          Add a Category
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name (EN)</Label>
            <Input
              id="name"
              value={newCategory.label}
              onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
              placeholder="Enter category name in English"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nameAr">Category Name (AR)</Label>
            <Input
              id="nameAr"
              value={newCategory.labelAr}
              onChange={(e) => setNewCategory({ ...newCategory, labelAr: e.target.value })}
              placeholder="Enter category name in Arabic"
              dir="rtl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parent">Parent Category (optional)</Label>
            <select
              id="parent"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={newCategory.parentId}
              onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
            >
              <option value="">None (Top level category)</option>
              {menuData.map(item => (
                <option key={item.id} value={item.label}>{item.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={onAdd} style={{backgroundColor: 'black',color: 'white'}}>
            Add Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
