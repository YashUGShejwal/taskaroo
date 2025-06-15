'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h2>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Habits</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Completion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">0%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Current Streak</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">0 days</p>
        </div>
      </div>
    </div>
  )
} 