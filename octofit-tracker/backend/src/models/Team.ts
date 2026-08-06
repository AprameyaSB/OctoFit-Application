import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  color: string;
  memberIds: Types.ObjectId[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: 'A team of active learners' },
    color: { type: String, default: '#2563eb' },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
