import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IActivity extends Document {
  userId: Types.ObjectId;
  teamId?: Types.ObjectId;
  type: 'run' | 'walk' | 'strength' | 'cycle' | 'yoga' | 'sports';
  durationMinutes: number;
  distanceMiles?: number;
  intensity: 'easy' | 'moderate' | 'hard';
  points: number;
  notes?: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    type: {
      type: String,
      enum: ['run', 'walk', 'strength', 'cycle', 'yoga', 'sports'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceMiles: { type: Number, min: 0 },
    intensity: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'moderate',
    },
    points: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
