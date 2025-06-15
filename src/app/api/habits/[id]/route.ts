import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Habit } from '@/models/habit.model';

// PUT /api/habits/[id] - Update a habit
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { message: 'Habit name is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const habit = await Habit.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { name, description },
      { new: true }
    );

    if (!habit) {
      return NextResponse.json(
        { message: 'Habit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(habit);
  } catch (error: any) {
    console.error('Error updating habit:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A habit with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Error updating habit' },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const habit = await Habit.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!habit) {
      return NextResponse.json(
        { message: 'Habit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json(
      { message: 'Error deleting habit' },
      { status: 500 }
    );
  }
} 