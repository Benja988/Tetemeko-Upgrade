'use client'

// import { usePathname } from 'next/navigation'

export default function DashboardHeader() {
  // const pathname = usePathname()
  // const page = pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'DASHBOARD'

  return (
    <header className="bg-white shadow px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="text-lg sm:text-2xl font-bold text-[var(--color-primary)] truncate max-w-[70%]">
        {/* {page} */}
      </div>

      <div className="flex items-center gap-4">
        {/* Profile Placeholder */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-[var(--color-primary)]">
          A
        </div>
      </div>
    </header>
  )
}
