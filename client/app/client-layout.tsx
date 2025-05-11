"use client";

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className={!isLoginPage ? 'flex' : ''}>
      {!isLoginPage && <Sidebar />}
      <main className={`${isLoginPage ? 'w-full' : 'flex-1'} p-6 bg-white overflow-x-auto max-w-full`}>
        {children}
      </main>
    </div>
  );
}
