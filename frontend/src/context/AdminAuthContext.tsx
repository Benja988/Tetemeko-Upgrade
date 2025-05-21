'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAdminProfile, refreshToken } from '@/lib/auth';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  setAdmin: (admin: Admin | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const handleProfile = (profile: Admin) => {
    if (profile.role?.toLowerCase() === 'admin') {
      setAdmin(profile);
    } else {
      setAdmin(null);
    }
  };

  const loadProfile = async () => {
    try {
      const profile = await getAdminProfile();
      handleProfile(profile);
    } catch {
      try {
        await refreshToken();
        const profile = await getAdminProfile();
        handleProfile(profile);
        console.log('Token refreshed successfully');
      } catch {
        setAdmin(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
