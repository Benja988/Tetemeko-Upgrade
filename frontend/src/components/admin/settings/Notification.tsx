'use client';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

export default function Notification({ message, type }: NotificationProps) {
  const baseStyle = 'p-4 rounded-md text-sm';
  const typeStyle =
    type === 'success'
      ? 'bg-green-100 text-green-800 border border-green-300'
      : 'bg-red-100 text-red-800 border border-red-300';

  return <div className={`${baseStyle} ${typeStyle}`}>{message}</div>;
}
