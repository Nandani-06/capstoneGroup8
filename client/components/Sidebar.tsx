// client/components/Sidebar.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Data Upload', href: '/upload' },
  { label: 'Data Preview', href: '/preview' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Workshops', href: '/workshop' },

]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-100 border-r px-4 py-6">
      {/* Logo above the title */}
      <div className="flex flex-col items-start mb-6">
        <Image
          src="/logo/logo.png"         // maps to public/logo/logo.png
          alt="Einstein First Logo"
          width={160}                   // adjust for desired size
          height={160}
        />
        <h2 className="mt-2 text-2xl font-bold text-gray-800">
          EFP Admin
        </h2>
      </div>

      {/* Navigation menu */}
      <nav className="space-y-2">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`
              block px-4 py-2 rounded text-sm font-medium transition
              ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
