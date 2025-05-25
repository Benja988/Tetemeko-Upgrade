'use client';

import { useParams } from 'next/navigation';
import UsersPageLayout from '@/components/admin/users/UsersPageLayout';

export default function CategoryUsersPage() {
  const { category } = useParams();

  const displayName = (category as string)?.replace(/^\w/, (c) => c.toUpperCase());

  const tabBasedFilter = (() => {
    switch (category) {
      case 'pending':
        return 'unverified';
      case 'locked':
        return 'locked';
      case 'inactive':
        return 'inactive';
      case 'admins':
        return 'admin';
      default:
        return '';
    }
  })();

  return (
    <UsersPageLayout
      heading={`User Management – ${displayName}`}
      defaultFilter={tabBasedFilter}
    />
  );
}
