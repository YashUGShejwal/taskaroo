import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { DailyRecord } from '@/models/daily-record.model';

// GET /api/daily-records - Get daily records for a date range
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    await connectToDatabase();
    const startDate = new Date(parseInt(year), parseInt(month), 1);
    const endDate = new Date(parseInt(year), parseInt(month) + 1, 0);

    const records = await DailyRecord.find({
      userId: session.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('habitId');

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching daily records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/daily-records - Create or update daily record
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();

    // Update or create records for each habit
    const records = await Promise.all(
      data.habits.map(async (habit: { id: string; completed: boolean }) => {
        const existingRecord = await DailyRecord.findOne({
          userId: session.user.id,
          date: new Date(data.date),
          habitId: habit.id,
        });

        if (existingRecord) {
          existingRecord.completed = habit.completed;
          return existingRecord.save();
        }

        return DailyRecord.create({
          userId: session.user.id,
          date: new Date(data.date),
          habitId: habit.id,
          completed: habit.completed,
        });
      })
    );

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error creating daily records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 