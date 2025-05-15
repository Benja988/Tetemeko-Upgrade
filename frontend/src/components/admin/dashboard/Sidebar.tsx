'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Stations', href: '/admin/stations' },
  { label: 'News', href: '/admin/news' },
  { label: 'Podcasts', href: '/admin/podcasts' },
  { label: 'Marketplace', href: '/admin/marketplace' },
  { label: 'Ads', href: '/admin/ads' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[var(--color-primary)] text-white 
        flex flex-col p-4 space-y-6 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tetemeko</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span
                    className={`block py-2 px-4 rounded-lg hover:bg-[var(--color-secondary)] transition
                    ${pathname.startsWith(item.href) ? 'bg-[var(--color-secondary)]' : ''}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-[var(--color-primary)] text-white rounded-md lg:hidden"
      >
        ☰
      </button>
    </>
  )
}
