'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HabitForm from '@/components/HabitForm';
import { Habit } from '@/types';

export default function HabitsPage() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHabits();
      setIsLoading(false);
    }
  }, [session]);

  const handleAddHabit = async (habit: Omit<Habit, '_id'>) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habit),
      });

      if (!response.ok) throw new Error('Failed to create habit');
      
      const newHabit = await response.json();
      setHabits(prev => [...prev, newHabit]);
      setIsHabitFormOpen(false);
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleUpdateHabit = async (id: string, habit: Partial<Habit>) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habit),
      });

      if (!response.ok) throw new Error('Failed to update habit');
      
      const updatedHabit = await response.json();
      setHabits(prev => prev.map(h => h._id === id ? updatedHabit : h));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete habit');
      
      setHabits(prev => prev.filter(h => h._id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
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
            Please sign in to manage your habits
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#00809D]">Manage Habits</h2>
        <button
          onClick={() => setIsHabitFormOpen(true)}
          className="px-4 py-2 bg-[#FF7601] text-white rounded-md hover:bg-[#F3A26D] transition-colors"
        >
          Add New Habit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {habits.map((habit) => (
            <li key={habit._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-[#00809D]">{habit.name}</h3>
                    {habit.description && (
                      <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateHabit(habit._id, { ...habit })}
                    className="px-3 py-1 text-sm text-[#00809D] hover:text-[#FF7601] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit._id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {habits.length === 0 && (
            <li className="p-6 text-center text-gray-500">
              No habits added yet. Click "Add New Habit" to get started.
            </li>
          )}
        </ul>
      </div>

      {isHabitFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#00809D]">Add New Habit</h3>
              <button
                onClick={() => setIsHabitFormOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <HabitForm
              onSubmit={handleAddHabit}
              onClose={() => setIsHabitFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 