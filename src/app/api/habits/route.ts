import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Habit } from '@/models/habit.model';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';

// GET /api/habits - Get all habits for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const habits = await Habit.find({ userId: session.user.email });
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const habit = await Habit.create({
      ...body,
      userId: session.user.email
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 