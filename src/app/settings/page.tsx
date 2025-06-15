'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notification Settings
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage how you receive notifications.</p>
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="email-notifications"
                    className="font-medium text-gray-700"
                  >
                    Email Notifications
                  </label>
                  <p className="text-gray-500">
                    Receive notifications about your account activity via email.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="push-notifications"
                    name="push-notifications"
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="push-notifications"
                    className="font-medium text-gray-700"
                  >
                    Push Notifications
                  </label>
                  <p className="text-gray-500">
                    Receive push notifications on your devices.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="marketing-notifications"
                    name="marketing-notifications"
                    type="checkbox"
                    checked={notifications.marketing}
                    onChange={() => handleNotificationChange('marketing')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="marketing-notifications"
                    className="font-medium text-gray-700"
                  >
                    Marketing Notifications
                  </label>
                  <p className="text-gray-500">
                    Receive notifications about new features and promotions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Theme Settings
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Customize your application theme.</p>
            </div>
            <div className="mt-5">
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700"
              >
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                defaultValue="light"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Language Settings
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Choose your preferred language.</p>
            </div>
            <div className="mt-5">
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 