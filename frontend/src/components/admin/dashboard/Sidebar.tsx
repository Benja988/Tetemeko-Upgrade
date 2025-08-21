'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  ChevronLeft,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { navItems } from '@/data/sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/auth/logout';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useAuthGuard();
    const { user, logout } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      setIsAuthenticated(true);
    }, []);


  const handleLogout = async () => {
    await logoutUser(router);
  };

  // Initialize submenus and theme
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
    
    // Detect system theme
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    setMounted(true);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, [pathname]);

  const toggleSubmenu = useCallback((label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const handleNavigation = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
  }, [router]);

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

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

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

  const isCollapsed = collapsed && !isHovering;

  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white
          ${open ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full w-0'}
          lg:translate-x-0 lg:static lg:inset-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
        role="navigation"
        aria-label="Admin Sidebar"
        tabIndex={open ? 0 : -1}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-16 dark:border-gray-700">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <h2 className="text-xl font-bold tracking-tight">Tetemeko</h2>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                v1.0.0
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-xl font-bold">T</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  admin@tetemeko.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasActiveChild = item.subItems?.some(
                (sub) => pathname === sub.href
              );
              const Icon = getIcon(item.label);

              if (isCollapsed) {
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        w-full h-10 flex items-center justify-center rounded-md
                        transition-colors relative
                        ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 
                          'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}
                      `}
                      aria-label={item.label}
                    >
                      {Icon}
                      {isActive && (
                        <span className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                      )}
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <div
                    className={`
                      flex items-center justify-between rounded-md
                      transition-colors
                      ${isActive || hasActiveChild
                        ? 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                    `}
                  >
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        flex items-center gap-3 px-4 py-3 flex-grow h-auto text-sm
                        ${isActive ? 'font-semibold' : ''}
                      `}
                    >
                      {Icon}
                      <span>{item.label}</span>
                    </button>
                    {item.subItems && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu(item.label);
                        }}
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                    <div className="ml-8 mt-1 space-y-1 overflow-hidden">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <div key={sub.href} className="relative">
                            <button
                              onClick={() => handleNavigation(sub.href)}
                              className={`
                                flex items-center gap-3 px-4 py-2.5 text-sm rounded-md w-full
                                transition-colors
                                ${isSubActive
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}
                              `}
                            >
                              {getIcon(sub.label)}
                              <span>{sub.label}</span>
                            </button>
                            {isSubActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t dark:border-gray-700">
          {!isCollapsed ? (
            <div className="space-y-2">
              <button
                className="flex items-center gap-3 px-4 py-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm">Help & Support</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Help & Support"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className={`
          fixed top-4 left-4 z-40 p-2 rounded-full shadow-md transition-colors
          bg-white dark:bg-gray-800 text-gray-700 dark:text-white
          hover:bg-gray-100 dark:hover:bg-gray-700
          lg:hidden
        `}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}