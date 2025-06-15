'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="bg-[#FCECDD] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-[#FF7601] hover:text-[#F3A26D] transition-colors">
              Taskaroo
            </h1>
          </Link>
          <p className="mt-4 text-xl text-[#00809D] max-w-2xl mx-auto">
            Build better habits, one day at a time. Track your progress, stay motivated, and achieve your goals with our simple and intuitive habit tracking app.
          </p>
          <div className="mt-8">
            <Link
              href="/habits"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF7601] hover:bg-[#F3A26D] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 