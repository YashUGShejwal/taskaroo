import mongoose, { Document, Schema } from 'mongoose';

// Disable strictPopulate globally
mongoose.set('strictPopulate', false);

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

// Define the sub-schema for completions properly
const habitCompletionSchema = new Schema<IHabitCompletion>({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { 
  _id: false,
  timestamps: false 
});

// Main Daily Record schema
const dailyRecordSchema = new Schema<IDailyRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    completions: {
      type: [habitCompletionSchema],
      required: true,
      default: [],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure unique record per user per day
dailyRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

// Auto-calculate score before saving
dailyRecordSchema.pre('save', function (next) {
  if (this.completions.length > 0) {
    const completedCount = this.completions.filter((c) => c.completed).length;
    this.score = completedCount / this.completions.length;
  } else {
    this.score = 0;
  }
  next();
});

// Create the model
export const DailyRecord =
  mongoose.models.DailyRecord ||
  mongoose.model<IDailyRecord>('DailyRecord', dailyRecordSchema);
