'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-blue-200">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center py-4">
        {/* Logo(need to chage) */}
        <img
          src="/favicon.ico"
          alt="Logo"
          className="w-12 h-12 mb-2 rounded-full"
        />

        {/* Navigation */}
        <nav className="flex space-x-12 md:text-lg text-sm mt-4 mb-5">
          <Link
            href="/"
            className="text-black hover:text-blue-600 font-medium transition duration-200"
          >
            Upload
          </Link>
          <Link
            href="/analytics"
            className="text-black hover:text-blue-600 font-medium transition duration-200"
          >
            Analytics
          </Link>
          <Link
            href="/view"
            className="text-black hover:text-blue-600 font-medium transition duration-200"
          >
            View
          </Link>
        </nav>
      </div>
    </header>
  );
}
