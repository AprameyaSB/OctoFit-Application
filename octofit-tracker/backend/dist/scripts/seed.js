"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Activity_1 = __importDefault(require("../models/Activity"));
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
const Workout_1 = __importDefault(require("../models/Workout"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function seedDatabase() {
    try {
        console.log('Seed the octofit_db database with test data');
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User_1.default.deleteMany({}),
            Team_1.default.deleteMany({}),
            Activity_1.default.deleteMany({}),
            Workout_1.default.deleteMany({}),
        ]);
        const teamOne = await Team_1.default.create({
            name: 'Storm Squad',
            description: 'Fast-paced runners and walkers',
            color: '#2563eb',
            totalPoints: 0,
        });
        const teamTwo = await Team_1.default.create({
            name: 'Power Builders',
            description: 'Strength and mobility focused',
            color: '#dc2626',
            totalPoints: 0,
        });
        const users = await User_1.default.insertMany([
            { name: 'Mia', email: 'mia@example.com', age: 15, fitnessLevel: 'intermediate', teamId: teamOne._id, totalPoints: 0 },
            { name: 'Leo', email: 'leo@example.com', age: 16, fitnessLevel: 'advanced', teamId: teamTwo._id, totalPoints: 0 },
            { name: 'Ava', email: 'ava@example.com', age: 14, fitnessLevel: 'beginner', teamId: teamOne._id, totalPoints: 0 },
        ]);
        await Workout_1.default.insertMany([
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
        const sampleActivity = await Activity_1.default.create({
            userId: users[0]._id,
            teamId: teamOne._id,
            type: 'run',
            durationMinutes: 30,
            intensity: 'moderate',
            points: 18,
            notes: 'Great pace during the morning run',
            completedAt: new Date(),
        });
        await User_1.default.findByIdAndUpdate(users[0]._id, { $inc: { totalPoints: sampleActivity.points } });
        await Team_1.default.findByIdAndUpdate(teamOne._id, { $inc: { totalPoints: sampleActivity.points } });
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
