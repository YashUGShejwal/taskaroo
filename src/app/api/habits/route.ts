import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Habit } from '@/models/habit.model';
import { getServerSession } from 'next-auth';

// GET /api/habits - Get all habits for the current user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find habits for the current user using $where to avoid ObjectId casting
    const habits = await Habit.find({
      $expr: {
        $eq: ['$userId', session.user.email]
      }
    });
    console.log('User habits:', habits);
    
    return NextResponse.json(habits);
  } catch (error: any) {
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const habitData = {
      ...body,
      userId: session.user.email
    };

    console.log('Creating habit with data:', habitData);

    const habit = new Habit(habitData);
    await habit.save();

    return NextResponse.json(habit);
  } catch (error: any) {
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 