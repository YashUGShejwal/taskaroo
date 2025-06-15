import mongoose from 'mongoose';

const dailyRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for userId, date, and habitId to ensure uniqueness
dailyRecordSchema.index({ userId: 1, date: 1, habitId: 1 }, { unique: true });

// Create the model if it doesn't exist, or use the existing one
export const DailyRecord =
  mongoose.models.DailyRecord || mongoose.model('DailyRecord', dailyRecordSchema); 