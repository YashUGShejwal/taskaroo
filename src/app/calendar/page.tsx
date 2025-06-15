'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import Calendar from '@/components/Calendar';
import DayDetailModal from '@/components/DayDetailModal';
import { Habit } from '@/models/habit.model';
import { DailyRecord } from '@/models/daily-record.model';

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const fetchDailyRecords = async () => {
    try {
      const response = await fetch(
        `/api/daily-records?month=${currentMonth.getMonth()}&year=${currentMonth.getFullYear()}`
      );
      if (!response.ok) throw new Error('Failed to fetch daily records');
      const data = await response.json();
      setDailyRecords(data);
    } catch (error) {
      console.error('Error fetching daily records:', error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setIsLoading(true);
      Promise.all([fetchHabits(), fetchDailyRecords()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [session, currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleSubmitDetails = async (completedHabits: { id: string; completed: boolean }[]) => {
    if (!selectedDate) return;

    try {
      const response = await fetch('/api/daily-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          habits: completedHabits,
        }),
      });

      if (!response.ok) throw new Error('Failed to save daily records');
      await fetchDailyRecords();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving daily records:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your calendar</h1>
        <p className="text-gray-600">You need to be signed in to track your habits.</p>
      </div>
    );
  }

  const getRecordsForDate = (date: Date) => {
    return dailyRecords.filter(
      (record) =>
        record.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Track your daily habits and progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Calendar
            habits={habits}
            dailyRecords={dailyRecords}
            onDateClick={handleDateClick}
            onMonthChange={handleMonthChange}
            getRecordsForDate={getRecordsForDate}
          />
        </div>

        {selectedDate && (
          <DayDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            date={selectedDate}
            habits={habits}
            dailyRecords={getRecordsForDate(selectedDate)}
            onSubmit={handleSubmitDetails}
          />
        )}
      </div>
    </div>
  );
} 