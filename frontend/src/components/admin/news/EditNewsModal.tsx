import { News } from '@/interfaces/News';
import Modal from './Modal';
import NewsArticleForm from './create/NewsArticleForm';

interface Props {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditNewsModal({ news, isOpen, onClose, onSuccess }: Props) {
  if (!news) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Article">
      <NewsArticleForm
        existingNews={news}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
}
