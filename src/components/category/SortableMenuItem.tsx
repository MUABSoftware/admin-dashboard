
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
// import { MenuItem } from '@/types/navigation';
import { MenuItem } from '@src/types/navigation';

interface SortableMenuItemProps {
  item: MenuItem;
  isSubItem?: boolean;
  onEdit: (label: string) => void;
  onDelete: (label: string) => void;
}

const SortableMenuItem = ({ item, isSubItem = false, onEdit, onDelete }: SortableMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 cursor-pointer border border-neutral-200 rounded bg-white hover:bg-neutral-50 ${
        isSubItem ? 'ml-8' : ''
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        <button
          className="p-1 hover:bg-neutral-100 rounded cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-neutral-400" />
        </button>
        <div className="flex flex-col">
          <span className="text-neutral-800 font-medium">{item.label}</span>
          {item.labelAr && (
            <span className="text-neutral-600 text-sm" dir="rtl">{item.labelAr}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          className="p-1 hover:bg-neutral-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.label);
          }}
        >
          <Pencil className="w-4 h-4 text-neutral-600" />
        </button>
        <button 
          className="p-1 hover:bg-neutral-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.label);
          }}
        >
          <Trash2 className="w-4 h-4 text-neutral-600" />
        </button>
      </div>
    </div>
  );
};

export default SortableMenuItem;
