import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'mobility' | 'recovery';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetArea: string;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['cardio', 'strength', 'mobility', 'recovery'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    targetArea: { type: String, default: 'Full body' },
  },
  { timestamps: true }
);

const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;
