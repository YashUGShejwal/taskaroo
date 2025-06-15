'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#FF7601] hover:text-[#F3A26D] transition-colors">
                Taskaroo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/calendar"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/calendar')
                    ? 'border-[#FF7601] text-[#00809D]'
                    : 'border-transparent text-gray-500 hover:border-[#F3A26D] hover:text-[#00809D]'
                }`}
              >
                Calendar
              </Link>
              <Link
                href="/habits"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/habits')
                    ? 'border-[#FF7601] text-[#00809D]'
                    : 'border-transparent text-gray-500 hover:border-[#F3A26D] hover:text-[#00809D]'
                }`}
              >
                Habits
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'border-[#FF7601] text-[#00809D]'
                    : 'border-transparent text-gray-500 hover:border-[#F3A26D] hover:text-[#00809D]'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <button
                onClick={() => signOut()}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF7601] hover:bg-[#F3A26D] transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF7601] hover:bg-[#F3A26D] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 