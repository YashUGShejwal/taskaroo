import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  userId: string;
  name: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  reminder: boolean;
  reminderTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: '#FF7601',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning',
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: String,
      default: '09:00',
    },
  },
  { timestamps: true }
);

// Create compound index for userId and name to ensure unique habit names per user
habitSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Habit = mongoose.models.Habit || mongoose.model<IHabit>('Habit', habitSchema); 