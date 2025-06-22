import { Category } from '@/interfaces/Category';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Props {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (slug: string) => void;
}

export default function CategoryRowActions({ category, onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <button onClick={() => onEdit(category)} className="text-blue-600 hover:underline">
        <FiEdit2 />
      </button>
      <button onClick={() => onDelete(category.slug)} className="text-red-600 hover:underline">
        <FiTrash2 />
      </button>
    </div>
  );
}
