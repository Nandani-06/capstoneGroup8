'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Data Upload', href: '/upload' },
  { label: 'Data Preview', href: '/preview' },
  { label: 'Dashboard', href: '/dashboard' },
  // Add more tabs here as needed
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-100 border-r px-4 py-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">EFP Admin</h2>
      <nav className="space-y-2">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-2 rounded text-sm font-medium transition
              ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
