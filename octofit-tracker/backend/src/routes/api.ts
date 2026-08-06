import { Router } from 'express';
import Activity from '../models/Activity';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const router = Router();

function calculateActivityPoints(type: string, durationMinutes: number, intensity: string) {
  const basePoints = {
    run: 8,
    walk: 5,
    strength: 7,
    cycle: 6,
    yoga: 4,
    sports: 6,
  }[type] ?? 5;

  const intensityMultiplier = {
    easy: 1,
    moderate: 1.2,
    hard: 1.5,
  }[intensity] ?? 1;

  return Math.round(basePoints * durationMinutes * intensityMultiplier / 10);
}

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1, createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users', error });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create user', error });
  }
});

router.get('/teams', async (_req, res) => {
  try {
    const teams = await Team.find().sort({ totalPoints: -1, createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load teams', error });
  }
});

router.post('/teams', async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create team', error });
  }
});

router.get('/activities', async (_req, res) => {
  try {
    const activities = await Activity.find().populate('userId').populate('teamId').sort({ completedAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load activities', error });
  }
});

router.post('/activities', async (req, res) => {
  try {
    const { userId, teamId, type, durationMinutes, distanceMiles, intensity, notes, completedAt } = req.body;
    const points = calculateActivityPoints(type, durationMinutes, intensity);

    const activity = await Activity.create({
      userId,
      teamId,
      type,
      durationMinutes,
      distanceMiles,
      intensity,
      notes,
      completedAt,
      points,
    });

    await User.findByIdAndUpdate(userId, { $inc: { totalPoints: points } });

    if (teamId) {
      await Team.findByIdAndUpdate(teamId, { $inc: { totalPoints: points } });
    }

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create activity', error });
  }
});

router.get('/workouts', async (_req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load workouts', error });
  }
});

router.post('/workouts', async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create workout', error });
  }
});

router.get('/leaderboard', async (_req, res) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
          workoutCount: { $sum: 1 },
          lastActivity: { $max: '$completedAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { totalPoints: -1, lastActivity: -1 } },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          fitnessLevel: '$user.fitnessLevel',
          totalPoints: 1,
          workoutCount: 1,
          lastActivity: 1,
        },
      },
    ]);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load leaderboard', error });
  }
});

export default router;
