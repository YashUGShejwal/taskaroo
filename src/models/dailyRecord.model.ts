import mongoose, { Document, Schema } from 'mongoose';

export interface IHabitCompletion {
  habitId: mongoose.Types.ObjectId;
  completed: boolean;
}

export interface IDailyRecord extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  completions: IHabitCompletion[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const dailyRecordSchema = new Schema<IDailyRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    completions: [{
      habitId: {
        type: Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
      },
      completed: {
        type: Boolean,
        required: true,
        default: false,
      },
    }],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  { timestamps: true }
);

// Create compound index for userId and date to ensure one record per day per user
dailyRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate score before saving
dailyRecordSchema.pre('save', function(next) {
  if (this.completions.length > 0) {
    const completedCount = this.completions.filter(c => c.completed).length;
    this.score = completedCount / this.completions.length;
  } else {
    this.score = 0;
  }
  next();
});

export const DailyRecord = mongoose.models.DailyRecord || mongoose.model<IDailyRecord>('DailyRecord', dailyRecordSchema); 