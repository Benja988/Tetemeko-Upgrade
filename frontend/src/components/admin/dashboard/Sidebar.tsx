'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  User,
  Radio,
  Newspaper,
  FileText,
  Mic,
  Tag,
  ShoppingBag,
  Package,
  ShoppingCart,
  Megaphone,
  Settings,
  Layout,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { navItems } from '@/data/sidebar';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize submenus based on current path
  useEffect(() => {
    const initialSubmenus: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.subItems) {
        initialSubmenus[item.label] = item.subItems.some(
          (sub) => pathname === sub.href
        );
      }
    });
    setOpenSubmenus(initialSubmenus);
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    'registered users': <User className="w-5 h-5" />,
    authors: <User className="w-5 h-5" />,
    stations: <Radio className="w-5 h-5" />,
    news: <Newspaper className="w-5 h-5" />,
    'all news': <FileText className="w-5 h-5" />,
    'create news': <FileText className="w-5 h-5" />,
    podcasts: <Mic className="w-5 h-5" />,
    'all podcasts': <Mic className="w-5 h-5" />,
    'create podcast': <Mic className="w-5 h-5" />,
    categories: <Tag className="w-5 h-5" />,
    marketplace: <ShoppingBag className="w-5 h-5" />,
    'all products': <Package className="w-5 h-5" />,
    'add product': <Package className="w-5 h-5" />,
    orders: <ShoppingCart className="w-5 h-5" />,
    ads: <Megaphone className="w-5 h-5" />,
    'all ads': <Megaphone className="w-5 h-5" />,
    'create ad': <Megaphone className="w-5 h-5" />,
    'ad campaigns': <Megaphone className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
    general: <Settings className="w-5 h-5" />,
    appearance: <Layout className="w-5 h-5" />,
  };

  const getIcon = (label: string) => {
    return iconMap[label.toLowerCase()] || null;
  };

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Focus sidebar when opened
  useEffect(() => {
    if (open && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [open]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 lg:shadow-lg`}
        role="navigation"
        aria-label="Admin Sidebar"
        tabIndex={open ? 0 : -1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white tracking-tight">Tetemeko</h2>
          <button
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasActiveChild = item.subItems?.some(
                (sub) => pathname === sub.href
              );

              return (
                <li key={item.href}>
                  <div
                    className={`flex items-center justify-between rounded-lg transition-colors duration-200 ${
                      isActive || hasActiveChild
                        ? 'bg-blue-600/20 text-white'
                        : 'hover:bg-gray-800 text-gray-200 hover:text-white'
                    }`}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 flex-grow ${
                        isActive ? 'font-semibold' : ''
                      }`}
                    >
                      {getIcon(item.label)}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                    {item.subItems && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu(item.label);
                        }}
                        className={`p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none ${
                          openSubmenus[item.label] ? 'text-white' : 'text-gray-400'
                        }`}
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        {openSubmenus[item.label] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {item.subItems && openSubmenus[item.label] && (
                    <ul className="ml-8 mt-1 space-y-1 animate-fadeIn">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                                isSubActive
                                  ? 'bg-blue-600 text-white font-medium'
                                  : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                              }`}
                            >
                              {getIcon(sub.label)}
                              <span>{sub.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer (optional) */}
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          <p>v1.0.0</p>
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-gray-900 text-white rounded-lg shadow-md lg:hidden hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}