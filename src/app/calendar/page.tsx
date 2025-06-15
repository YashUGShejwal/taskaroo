'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from '@/components/Calendar';
import DayDetailModal from '@/components/DayDetailModal';
import { Habit } from '@/models/habit.model';
import { DailyRecord } from '@/models/daily-record.model';
import { toast } from 'sonner';
import mongoose from 'mongoose';

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/habits', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    }
  }, []);

  const fetchDailyRecords = useCallback(async () => {
    try {
      const month = currentMonth.getMonth();
      const year = currentMonth.getFullYear();
      const response = await fetch(`/api/daily-records?month=${month}&year=${year}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch daily records');
      const data = await response.json();
      setDailyRecords(data);
    } catch (error) {
      console.error('Error fetching daily records:', error);
      toast.error('Failed to load daily records');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    if (session) {
      fetchHabits();
      fetchDailyRecords();
    }
  }, [session, currentMonth, fetchHabits, fetchDailyRecords]);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
    setIsRefreshing(true);
  }, []);

  const updateLocalRecords = useCallback((newRecords: DailyRecord[]) => {
    setDailyRecords(prev => {
      const filtered = prev.filter(r => 
        !newRecords.some(nr => nr._id === r._id)
      );
      return [...filtered, ...newRecords];
    });
  }, []);

  const handleSubmitDailyRecords = async (habits: { id: string; completed: boolean }[]) => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    const optimisticRecords = habits.map(habit => ({
      _id: new mongoose.Types.ObjectId().toString(),
      userId: session?.user?.id,
      date: selectedDate,
      completions: [{
        habitId: habit.id,
        completed: habit.completed
      }],
      score: habit.completed ? 1 : 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Optimistically update the UI
    setDailyRecords(prev => {
      const filteredRecords = prev.filter(record => 
        record.date !== selectedDate.toISOString().split('T')[0]
      );
      return [...filteredRecords, ...optimisticRecords];
    });

    try {
      console.log('Submitting daily records:', {
        date: selectedDate.toISOString(),
        habits
      });

      const response = await fetch('/api/daily-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          habits
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to save daily records');
      }

      const updatedRecord = await response.json();
      console.log('Updated record from server:', updatedRecord);

      // Update the state with the server response
      setDailyRecords(prev => {
        const filteredRecords = prev.filter(record => 
          record.date !== selectedDate.toISOString().split('T')[0]
        );
        return [...filteredRecords, updatedRecord];
      });

      toast.success('Daily records updated successfully');
    } catch (error) {
      console.error('Error saving daily records:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save daily records');

      // Revert optimistic updates on error
      setDailyRecords(prev => {
        const filteredRecords = prev.filter(record => 
          record.date !== selectedDate.toISOString().split('T')[0]
        );
        return filteredRecords;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecordsForDate = useCallback((date: Date) => {
    return dailyRecords.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === date.getDate() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getFullYear() === date.getFullYear()
      );
    });
  }, [dailyRecords]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7601]"></div>
      </div>
    );
  }

  if (isRefreshing) {
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
            Please sign in to view your calendar
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#00809D]">Calendar</h2>
        {selectedDate && (
          <p className="mt-2 text-gray-600">
            Selected date: {selectedDate.toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar
            habits={habits}
            dailyRecords={dailyRecords}
            onDateClick={handleDateClick}
            onMonthChange={handleMonthChange}
            getRecordsForDate={getRecordsForDate}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-[#00809D] mb-4">Your Habits</h3>
          <ul className="space-y-3">
            {habits.map(habit => (
              <li key={habit._id} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="text-gray-700">{habit.name}</span>
              </li>
            ))}
            {habits.length === 0 && (
              <li className="text-gray-500">No habits added yet.</li>
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          habits={habits}
          dailyRecords={getRecordsForDate(selectedDate)}
          onSubmit={handleSubmitDailyRecords}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 