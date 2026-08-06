import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  teamId?: Types.ObjectId;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, required: true, min: 1 },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
