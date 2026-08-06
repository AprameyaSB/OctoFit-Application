import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teamOne = await Team.create({
      name: 'Storm Squad',
      description: 'Fast-paced runners and walkers',
      color: '#2563eb',
      totalPoints: 0,
    });

    const teamTwo = await Team.create({
      name: 'Power Builders',
      description: 'Strength and mobility focused',
      color: '#dc2626',
      totalPoints: 0,
    });

    const users = await User.insertMany([
      { name: 'Mia', email: 'mia@example.com', age: 15, fitnessLevel: 'intermediate', teamId: teamOne._id, totalPoints: 0 },
      { name: 'Leo', email: 'leo@example.com', age: 16, fitnessLevel: 'advanced', teamId: teamTwo._id, totalPoints: 0 },
      { name: 'Ava', email: 'ava@example.com', age: 14, fitnessLevel: 'beginner', teamId: teamOne._id, totalPoints: 0 },
    ]);

    await Workout.insertMany([
      {
        title: 'Morning Mile',
        description: 'A brisk warm-up run for the whole team.',
        category: 'cardio',
        durationMinutes: 20,
        difficulty: 'beginner',
        targetArea: 'Cardio',
      },
      {
        title: 'Core and Strength Circuit',
        description: 'A short bodyweight strength workout.',
        category: 'strength',
        durationMinutes: 25,
        difficulty: 'intermediate',
        targetArea: 'Core',
      },
    ]);

    const sampleActivity = await Activity.create({
      userId: users[0]._id,
      teamId: teamOne._id,
      type: 'run',
      durationMinutes: 30,
      intensity: 'moderate',
      points: 18,
      notes: 'Great pace during the morning run',
      completedAt: new Date(),
    });

    await User.findByIdAndUpdate(users[0]._id, { $inc: { totalPoints: sampleActivity.points } });
    await Team.findByIdAndUpdate(teamOne._id, { $inc: { totalPoints: sampleActivity.points } });

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
