'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { IHabit } from '@/models/habit.model';
import type { IDailyRecord } from '@/models/daily-record.model';
import mongoose from 'mongoose';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  habits: IHabit[];
  dailyRecords: IDailyRecord[];
  onSubmit: (habits: { id: string; completed: boolean }[]) => void;
  isSubmitting: boolean;
}

export default function DayDetailModal({
  isOpen,
  onClose,
  date,
  habits,
  dailyRecords,
  onSubmit,
  isSubmitting,
}: DayDetailModalProps) {
  const [completedHabits, setCompletedHabits] = useState<{ id: string; completed: boolean }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Initialize completed habits from existing records
      const initialCompletedHabits = habits.map(habit => {
        // Find any completion record for this habit
        const completion = dailyRecords
          .flatMap(record => record.completions || [])
          .find(c => c.habitId?.toString() === (habit._id as mongoose.Types.ObjectId).toString());

        return {
          id: (habit._id as mongoose.Types.ObjectId).toString(),
          completed: completion?.completed || false,
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

  const hasExistingRecords = dailyRecords.some(record => (record.completions || []).length > 0);

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
              disabled={isSubmitting}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {habits.map(habit => {
              const completedHabit = completedHabits.find(h => h.id === (habit._id as mongoose.Types.ObjectId).toString());
              return (
                <div
                  key={(habit._id as mongoose.Types.ObjectId).toString()}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-gray-900">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => handleHabitToggle((habit._id as mongoose.Types.ObjectId).toString())}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium
                      ${completedHabit?.completed
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                      transition-colors
                    `}
                    disabled={isSubmitting}
                  >
                    {completedHabit?.completed ? 'Completed' : 'Not Completed'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF7601] hover:bg-[#E66A00] rounded-md transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 