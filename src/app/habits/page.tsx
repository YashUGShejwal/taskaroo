'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IHabit } from '@/models/habit.model';
import { DailyRecord } from '@/models/daily-record.model';
import mongoose from 'mongoose';

interface IDailyRecord {
  _id: mongoose.Types.ObjectId;
  userId: string;
  date: Date;
  habitId: mongoose.Types.ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type Frequency = 'daily' | 'weekly' | 'monthly';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';

interface NewHabit {
  name: string;
  color: string;
  frequency: Frequency;
  timeOfDay: TimeOfDay;
  reminder: boolean;
  reminderTime: string;
}

export default function HabitsPage() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [dailyRecords, setDailyRecords] = useState<IDailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newHabit, setNewHabit] = useState<NewHabit>({
    name: '',
    color: '#FF7601',
    frequency: 'daily',
    timeOfDay: 'morning',
    reminder: false,
    reminderTime: '09:00',
  });

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      alert('Failed to load habits. Please refresh the page.');
    }
  };

  const fetchDailyRecords = async () => {
    try {
      const today = new Date();
      const month = today.getMonth();
      const year = today.getFullYear();
      
      const response = await fetch(`/api/daily-records?month=${month}&year=${year}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch daily records');
      }
      
      const data = await response.json();
      setDailyRecords(data);
    } catch (error) {
      console.error('Error fetching daily records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHabits();
      fetchDailyRecords();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newHabit),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create habit');
      }

      const createdHabit = await response.json();
      setHabits(prev => [...prev, createdHabit]);
      setNewHabit({
        name: '',
        color: '#FF7601',
        frequency: 'daily',
        timeOfDay: 'morning',
        reminder: false,
        reminderTime: '09:00',
      });
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete habit');
      }

      setHabits(prev => prev.filter(habit => habit._id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  const handleToggleComplete = async (habitId: string, date: Date) => {
    try {
      const existingRecord = dailyRecords.find(
        record =>
          record.habitId.toString() === habitId &&
          new Date(record.date).toDateString() === date.toDateString()
      );

      const response = await fetch('/api/daily-records', {
        method: existingRecord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          habitId,
          date,
          completed: existingRecord ? !existingRecord.completed : true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update record');
      }

      const updatedRecord = await response.json();
      setDailyRecords(prev => {
        const filtered = prev.filter(
          record =>
            !(
              record.habitId.toString() === habitId &&
              new Date(record.date).toDateString() === date.toDateString()
            )
        );
        return [...filtered, updatedRecord];
      });
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Failed to update record. Please try again.');
    }
  };

  const getCompletionStatus = (habitId: string, date: Date) => {
    return dailyRecords.some(
      record =>
        record.habitId.toString() === habitId &&
        new Date(record.date).toDateString() === date.toDateString() &&
        record.completed
    );
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Frequency;
    setNewHabit(prev => ({ ...prev, frequency: value }));
  };

  const handleTimeOfDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TimeOfDay;
    setNewHabit(prev => ({ ...prev, timeOfDay: value }));
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7601]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#00809D]">
            Please sign in to view your habits
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#00809D]">Habits</h2>
        <p className="mt-2 text-gray-600">
          Track your daily habits and build a better routine
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-[#00809D] mb-4">
              Your Habits
            </h3>
            <ul className="space-y-4">
              {habits.map(habit => (
                <li
                  key={habit._id?.toString() || ''}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-gray-900">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(habit._id?.toString() || '')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {habits.length === 0 && (
                <li className="text-gray-500">No habits added yet.</li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-[#00809D] mb-4">
              Add New Habit
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Habit Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newHabit.name}
                  onChange={e =>
                    setNewHabit(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF7601] focus:ring-[#FF7601] sm:text-sm"
                  placeholder="e.g., Morning Meditation"
                />
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  value={newHabit.color}
                  onChange={e =>
                    setNewHabit(prev => ({ ...prev, color: e.target.value }))
                  }
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-[#FF7601] focus:ring-[#FF7601]"
                />
              </div>

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={newHabit.frequency}
                  onChange={handleFrequencyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF7601] focus:ring-[#FF7601] sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timeOfDay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time of Day
                </label>
                <select
                  id="timeOfDay"
                  value={newHabit.timeOfDay}
                  onChange={handleTimeOfDayChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF7601] focus:ring-[#FF7601] sm:text-sm"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newHabit.reminder}
                  onChange={e =>
                    setNewHabit(prev => ({ ...prev, reminder: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#FF7601] focus:ring-[#FF7601]"
                />
                <label
                  htmlFor="reminder"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Set Reminder
                </label>
              </div>

              {newHabit.reminder && (
                <div>
                  <label
                    htmlFor="reminderTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    id="reminderTime"
                    value={newHabit.reminderTime}
                    onChange={e =>
                      setNewHabit(prev => ({
                        ...prev,
                        reminderTime: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF7601] focus:ring-[#FF7601] sm:text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF7601] hover:bg-[#E66A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7601] disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Habit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 