'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
      const response = await fetch('/api/habits', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const fetchDailyRecords = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHabits();
      fetchDailyRecords();
    }
  }, [session, currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleSubmitDailyRecords = async (completedHabits: { id: string; completed: boolean }[]) => {
    try {
      const response = await fetch('/api/daily-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDate,
          habits: completedHabits,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save daily records');
      }

      const newRecords = await response.json();
      setDailyRecords(prev => {
        const filtered = prev.filter(r => 
          !newRecords.some((nr: DailyRecord) => nr._id === r._id)
        );
        return [...filtered, ...newRecords];
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving daily records:', error);
      alert('Failed to save daily records. Please try again.');
    }
  };

  const getRecordsForDate = (date: Date) => {
    return dailyRecords.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === date.getDate() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getFullYear() === date.getFullYear()
      );
    });
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
        />
      )}
    </div>
  );
} 