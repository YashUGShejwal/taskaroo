'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Habit } from '@/models/habit.model';
import { DailyRecord } from '@/models/daily-record.model';

interface CalendarProps {
  habits: Habit[];
  dailyRecords: DailyRecord[];
  onDateClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  getRecordsForDate: (date: Date) => DailyRecord[];
}

export default function Calendar({
  habits,
  dailyRecords,
  onDateClick,
  onMonthChange,
  getRecordsForDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  const getCompletionRate = (date: Date) => {
    const records = getRecordsForDate(date);
    if (records.length === 0) return 0;
    const completedCount = records.filter(r => r.completed).length;
    return completedCount / records.length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const completionRate = getCompletionRate(day);
          const hasRecords = getRecordsForDate(day).length > 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`
                relative p-2 h-24 border rounded-lg transition-colors
                ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                ${isCurrentDay ? 'border-indigo-500' : 'border-gray-200'}
                ${hasRecords ? 'bg-green-50' : ''}
              `}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              
              {hasRecords && (
                <div className="mt-1">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${completionRate * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {getRecordsForDate(day).map((record) => {
                      const habit = habits.find(h => h._id.toString() === record.habitId.toString());
                      if (!habit) return null;
                      return (
                        <div
                          key={record._id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 