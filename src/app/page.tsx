'use client';

import { useSession } from 'next-auth/react';
import Hero from '@/components/Hero';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <Hero />
      {!session && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#00809D]">
              Please sign in to start tracking your habits
            </h2>
          </div>
        </div>
      )}
    </div>
  );
} 