'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { navItems } from '@/data/sidebar'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tetemeko</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>✕</button>
        </div>

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

                {/* Sub Links */}
                {item.subItems && pathname.startsWith(item.href) && (
                  <ul className="ml-4 mt-2 flex flex-col gap-1 text-sm text-gray-300">
                    {item.subItems.map((sub) => (
                      <li key={sub.href}>
                        <Link href={sub.href}>
                          <span
                            className={`block py-1 px-3 rounded-md hover:text-white hover:bg-[var(--color-secondary-light)]
                            ${pathname === sub.href ? 'text-white font-semibold bg-[var(--color-secondary-light)]' : ''}`}
                          >
                            {sub.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-[var(--color-primary)] text-white rounded-md lg:hidden"
      >
        ☰
      </button>
    </>
  )
}
