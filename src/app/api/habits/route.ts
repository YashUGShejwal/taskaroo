import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Habit } from '@/models/habit.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/habits - Get all habits for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET /api/habits:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized: No valid session or user id');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    await connectToDatabase();
    
    const habits = await Habit.find({
      userId: new mongoose.Types.ObjectId(session.user.id)
    });
    
    console.log(`Found ${habits.length} habits for user ${session.user.id}`);
    return NextResponse.json(habits);
  } catch (error: any) {
    console.error('Error in GET /api/habits:', {
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
    const session = await getServerSession(authOptions);
    console.log('Session in POST /api/habits:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized: No valid session or user id');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    if (!body.name) {
      console.log('Bad Request: Missing habit name');
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const habitData = {
      ...body,
      userId: new mongoose.Types.ObjectId(session.user.id)
    };

    console.log('Creating habit with data:', habitData);

    const habit = new Habit(habitData);
    await habit.save();

    console.log('Successfully created habit:', habit);
    return NextResponse.json(habit);
  } catch (error: any) {
    console.error('Error in POST /api/habits:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 