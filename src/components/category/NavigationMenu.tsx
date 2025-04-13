
import { useState } from 'react';
import { useToast } from "@src/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// import { MenuItem, initialMenuData } from '@/types/navigation';
import { MenuItem, initialMenuData } from '@src/types/navigation';
import SortableMenuItem from './SortableMenuItem';
import AddCategoryDialog from './AddCategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';

const NavigationMenu = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>(initialMenuData);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ label: '', labelAr: '', parentId: '' });
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findItemById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeItem = (items: MenuItem[], itemId: string): MenuItem[] => {
    return items.reduce((acc: MenuItem[], item) => {
      if (item.id === itemId) {
        return acc;
      }
      if (item.subItems) {
        return [...acc, {
          ...item,
          subItems: removeItem(item.subItems, itemId)
        }];
      }
      return [...acc, item];
    }, []);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setMenuData(items => {
      const activeItem = findItemById(items, active.id as string);
      const overItem = findItemById(items, over.id as string);

      if (!activeItem || !overItem) return items;

      let newItems = removeItem(items, activeItem.id);
      const dropY = (event as any).activatorEvent.clientY;
      const targetRect = (event as any).over.rect;
      const targetMiddle = targetRect.top + targetRect.height / 2;

      if (dropY < targetMiddle) {
        const insertAtIndex = newItems.findIndex(item => item.id === overItem.id);
        if (insertAtIndex !== -1) {
          newItems.splice(insertAtIndex, 0, {
            ...activeItem,
            parentId: overItem.parentId
          });
        }
      } else {
        const dropPosition = (dropY - targetRect.top) / targetRect.height;
        
        if (dropPosition > 0.75) {
          const insertAtIndex = newItems.findIndex(item => item.id === overItem.id);
          if (insertAtIndex !== -1) {
            newItems.splice(insertAtIndex + 1, 0, {
              ...activeItem,
              parentId: overItem.parentId
            });
          }
        } else {
          newItems = newItems.map(item => {
            if (item.id === overItem.id) {
              return {
                ...item,
                subItems: [...(item.subItems || []), {
                  ...activeItem,
                  parentId: item.id
                }]
              };
            }
            return item;
          });
        }
      }

      toast({
        title: "Category moved",
        description: "The category has been successfully moved to its new position.",
      });

      return newItems;
    });
  };

  const handleDelete = (itemLabel: string) => {
    setItemToDelete(itemLabel);
    setIsDeleteOpen(true);
  };

  const handleEdit = (itemLabel: string) => {
    const newLabel = window.prompt("Enter new category name:", itemLabel);
    
    if (newLabel && newLabel !== itemLabel) {
      const updateLabels = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.label === itemLabel) {
            return { ...item, label: newLabel };
          }
          if (item.subItems) {
            return {
              ...item,
              subItems: updateLabels(item.subItems)
            };
          }
          return item;
        });
      };

      setMenuData(items => updateLabels(items));
      
      toast({
        title: "Updated successfully",
        description: `Category renamed to "${newLabel}"`,
      });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmText !== 'DELETE' || !itemToDelete) {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm",
        variant: "destructive",
      });
      return;
    }

    const deleteItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (item.label === itemToDelete) return false;
        if (item.subItems) {
          item.subItems = deleteItems(item.subItems);
        }
        
        return true;
      });
    };

    setMenuData(items => deleteItems(items));
    
    toast({
      title: "Deleted successfully",
      description: `"${itemToDelete}" has been removed`,
    });
    
    setIsDeleteOpen(false);
    setDeleteConfirmText('');
    setItemToDelete(null);
  };

  const handleAddCategory = () => {
    if (!newCategory.label.trim()) {
      toast({
        title: "Error",
        description: "English category name is required",
        variant: "destructive",
      });
      return;
    }

    const addToParent = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.label === newCategory.parentId) {
          return {
            ...item,
            subItems: [...(item.subItems || []), {
              id: String(Date.now()),
              label: newCategory.label,
              labelAr: newCategory.labelAr,
              parentId: item.id
            }]
          };
        }
        if (item.subItems) {
          return {
            ...item,
            subItems: addToParent(item.subItems)
          };
        }
        return item;
      });
    };

    setMenuData(prevData => {
      if (!newCategory.parentId) {
        return [...prevData, { 
          id: String(Date.now()),
          label: newCategory.label,
          labelAr: newCategory.labelAr 
        }];
      }
      return addToParent(prevData);
    });
    
    setNewCategory({ label: '', labelAr: '', parentId: '' });
    setIsAddOpen(false);
    
    toast({
      title: "Category added",
      description: `New category "${newCategory.label}" has been added`,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <AddCategoryDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        menuData={menuData}
        onAdd={handleAddCategory}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        itemToDelete={itemToDelete}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-2">
          <SortableContext
            items={menuData.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {menuData.map((item) => (
              <div key={item.id} className="space-y-2">
                <SortableMenuItem 
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {item.subItems && item.subItems.length > 0 && (
                  <SortableContext
                    items={item.subItems.map(sub => sub.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="ml-8 space-y-2">
                      {item.subItems.map(subItem => (
                        <SortableMenuItem
                          key={subItem.id}
                          item={subItem}
                          isSubItem
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default NavigationMenu;
