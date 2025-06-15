import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { DailyRecord } from '@/models/daily-record.model';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';

// GET /api/daily-records - Get daily records for a date range
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET /api/daily-records:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized: No valid session or user id');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    console.log('Query parameters:', { month, year });

    if (!month || !year) {
      console.log('Bad Request: Missing required parameters');
      return NextResponse.json(
        { error: 'Month and year are required query parameters' }, 
        { status: 400 }
      );
    }

    // Validate month and year are valid numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (isNaN(monthNum) || isNaN(yearNum)) {
      console.log('Bad Request: Invalid month or year format');
      return NextResponse.json(
        { error: 'Month and year must be valid numbers' },
        { status: 400 }
      );
    }

    if (monthNum < 0 || monthNum > 11) {
      console.log('Bad Request: Month must be between 0 and 11');
      return NextResponse.json(
        { error: 'Month must be between 0 and 11' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0);

    console.log('Date range:', { startDate, endDate });

    const records = await DailyRecord.find({
      userId: new mongoose.Types.ObjectId(session.user.id),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('habitId');

    console.log(`Found ${records.length} records for user ${session.user.id}`);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error in GET /api/daily-records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/daily-records - Create or update daily record
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST /api/daily-records:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized: No valid session or user id');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Request body:', data);

    if (!data.date || !Array.isArray(data.habits)) {
      console.log('Bad Request: Missing required fields');
      return NextResponse.json(
        { error: 'Date and habits array are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      console.log('Bad Request: Invalid date format');
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Validate habits array
    if (data.habits.length === 0) {
      console.log('Bad Request: Habits array is empty');
      return NextResponse.json(
        { error: 'At least one habit must be provided' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Update or create records for each habit
    const records = await Promise.all(
      data.habits.map(async (habit: { id: string; completed: boolean }) => {
        if (!habit.id) {
          console.log('Bad Request: Missing habit id');
          throw new Error('Habit id is required');
        }

        try {
          const existingRecord = await DailyRecord.findOne({
            userId: new mongoose.Types.ObjectId(session.user.id),
            date: date,
            habitId: new mongoose.Types.ObjectId(habit.id),
          });

          if (existingRecord) {
            existingRecord.completed = habit.completed;
            return existingRecord.save();
          }

          return DailyRecord.create({
            userId: new mongoose.Types.ObjectId(session.user.id),
            date: date,
            habitId: new mongoose.Types.ObjectId(habit.id),
            completed: habit.completed,
          });
        } catch (error) {
          console.error('Error processing habit:', habit, error);
          throw error;
        }
      })
    );

    console.log(`Successfully processed ${records.length} records`);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error in POST /api/daily-records:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 