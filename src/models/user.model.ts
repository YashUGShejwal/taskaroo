import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose schema for the User model.
 */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  },
  { timestamps: true }
);

/**
 * Pre-save middleware to hash the password before saving.
 * @param next - Mongoose next function
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Method to compare passwords.
 * @param candidatePassword - Password provided by the user
 * @returns Boolean indicating whether the passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);