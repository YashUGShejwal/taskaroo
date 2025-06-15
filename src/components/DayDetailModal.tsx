'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Habit } from '@/models/habit.model';
import { DailyRecord } from '@/models/daily-record.model';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  habits: Habit[];
  dailyRecords: DailyRecord[];
  onSubmit: (completedHabits: { id: string; completed: boolean }[]) => void;
}

export default function DayDetailModal({
  isOpen,
  onClose,
  date,
  habits,
  dailyRecords,
  onSubmit,
}: DayDetailModalProps) {
  const [completedHabits, setCompletedHabits] = useState<{ id: string; completed: boolean }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Initialize completed habits from existing records
      const initialCompletedHabits = habits.map(habit => {
        const record = dailyRecords.find(r => r.habitId.toString() === habit._id.toString());
        return {
          id: habit._id.toString(),
          completed: record?.completed || false,
        };
      });
      setCompletedHabits(initialCompletedHabits);
    }
  }, [isOpen, habits, dailyRecords]);

  if (!isOpen) return null;

  const handleHabitToggle = (habitId: string) => {
    setCompletedHabits(prev =>
      prev.map(habit =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(completedHabits);
  };

  const hasExistingRecords = dailyRecords.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {hasExistingRecords ? 'Edit Details' : 'Add Details'} for {format(date, 'MMMM d, yyyy')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {habits.map(habit => {
              const isCompleted = completedHabits.find(h => h.id === habit._id.toString())?.completed || false;
              return (
                <div
                  key={habit._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-gray-900">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => handleHabitToggle(habit._id.toString())}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 