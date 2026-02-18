import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestApp } from './setup';
import { TrainingProgram } from '../src/entities/training-program.entity';
import { BadgeDefinition } from '../src/entities/badge-definition.entity';
import { ChallengeDefinition } from '../src/entities/challenge-definition.entity';
import { StreakMilestone } from '../src/entities/streak-milestone.entity';

describe('Training (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let token: string;
  let dogId: string;

  // Valid IDs from training_programs table — "foundations" program, "f1" level
  const PROGRAM_ID = 'foundations';
  const LEVEL_ID = 'f1';
  const EXERCISE_IDS = ['f1a', 'f1b', 'f1c']; // Name Recognition, Eye Contact, Hand Touch
  const LEVEL_XP_REWARD = 50; // f1 level xpReward

  beforeAll(async () => {
    ({ app, module } = await createTestApp());

    // Seed static data that the training service now reads from the database
    const ds = module.get(DataSource);

    await ds.getRepository(TrainingProgram).save({
      id: 'foundations',
      name: 'Puppy Foundations',
      emoji: '🐾',
      description: 'Essential training for puppies',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
      unlockLevel: 0,
      difficulty: 'beginner',
      duration: '4 weeks',
      levels: [
        {
          id: 'f1',
          name: 'First Steps',
          xpReward: 50,
          description: 'Level 1',
          exercises: [
            { id: 'f1a', name: 'Name Recognition', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Teach name', steps: ['step1'], tips: 'tip', gear: [] },
            { id: 'f1b', name: 'Eye Contact', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Eye contact', steps: ['step1'], tips: 'tip', gear: [] },
            { id: 'f1c', name: 'Hand Touch', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Hand touch', steps: ['step1'], tips: 'tip', gear: [] },
          ],
        },
      ],
    });

    await ds.getRepository(BadgeDefinition).save([
      { id: 'first_session', name: 'First Session', emoji: '⭐', desc: 'Complete your first session', category: 'training' },
      { id: 'streak_3', name: '3-Day Streak', emoji: '🔥', desc: '3 day streak', category: 'streaks' },
      { id: 'streak_7', name: '7-Day Streak', emoji: '🔥', desc: '7 day streak', category: 'streaks' },
      { id: 'exercises_5', name: '5 Exercises', emoji: '💪', desc: 'Complete 5 exercises', category: 'training' },
      { id: 'level_complete', name: 'Level Complete', emoji: '🏆', desc: 'Complete a level', category: 'training' },
    ]);

    await ds.getRepository(StreakMilestone).save([
      { days: 3, reward: 'badge', rewardId: 'streak-3-days', name: '3 Day Streak', emoji: '🔥', xpBonus: 50, freezeReward: false },
      { days: 7, reward: 'badge', rewardId: 'streak-7-days', name: '7 Day Streak', emoji: '🔥', xpBonus: 100, freezeReward: false },
    ]);

    // Register a user
    const regRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'trainer@pawpath.com', name: 'Trainer', password: 'password123' });
    token = regRes.body.accessToken;

    // Create a dog
    const dogRes = await request(app.getHttpServer())
      .post('/api/dogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luna', breed: 'Golden Retriever' });
    dogId = dogRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/training/complete-exercise', () => {
    it('should complete an exercise and return XP gained', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(201);

      // XP = Math.round(levelXpReward / exercisesInLevel)
      // = Math.round(50 / 3) = 17
      const expectedXp = Math.round(LEVEL_XP_REWARD / EXERCISE_IDS.length);

      expect(res.body.xpGained).toBeGreaterThanOrEqual(expectedXp);
      expect(res.body.totalXP).toBeGreaterThanOrEqual(expectedXp);
      expect(res.body.isReview).toBe(false);
      expect(res.body.newStreak).toBeGreaterThanOrEqual(1);
      expect(res.body.completedExercises).toContain(EXERCISE_IDS[0]);
      expect(res.body.totalSessions).toBe(1);
      expect(res.body.newBadges).toContain('first_session');
    });

    it('should return reduced XP for review (same exercise again)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(201);

      expect(res.body.isReview).toBe(true);
      expect(res.body.totalSessions).toBe(2);
      expect(res.body.totalReviews).toBe(1);
      // Review XP = Math.round(baseXp * 0.3)
      const baseXp = Math.round(LEVEL_XP_REWARD / EXERCISE_IDS.length);
      const reviewXp = Math.round(baseXp * 0.3);
      expect(res.body.xpGained).toBeGreaterThanOrEqual(reviewXp);
    });

    it('should return 404 for non-existent dog', async () => {
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId: '00000000-0000-0000-0000-000000000000',
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(404);
    });

    it('should return 400 for invalid program', async () => {
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: 'nonexistent_program',
        })
        .expect(400);
    });

    it('should return 400 for invalid level', async () => {
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: 'nonexistent_level',
          programId: PROGRAM_ID,
        })
        .expect(400);
    });

    it('should return 400 for invalid exercise', async () => {
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: 'nonexistent_exercise',
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(401);
    });

    it('should mark level as completed when all exercises done', async () => {
      // Complete exercises f1b and f1c (f1a already done above)
      await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[1], // f1b
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[2], // f1c
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
        })
        .expect(201);

      expect(res.body.levelCompleted).toBe(true);
      expect(res.body.completedLevels).toContain(LEVEL_ID);
      expect(res.body.completedExercises).toEqual(
        expect.arrayContaining(EXERCISE_IDS),
      );
    });

    it('should accept optional journal data', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dogId,
          exerciseId: EXERCISE_IDS[0],
          levelId: LEVEL_ID,
          programId: PROGRAM_ID,
          journal: {
            note: 'Great session!',
            rating: 5,
            mood: 'excited',
          },
        })
        .expect(201);

      expect(res.body.isReview).toBe(true); // f1a was already done
    });
  });

  describe('GET /api/training/progress/:dogId', () => {
    it('should return training progress for a dog', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/training/progress/${dogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalXP');
      expect(res.body.totalXP).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('completedExercises');
      expect(res.body).toHaveProperty('completedLevels');
      expect(res.body).toHaveProperty('currentStreak');
      expect(res.body).toHaveProperty('bestStreak');
      expect(res.body).toHaveProperty('totalSessions');
      expect(res.body).toHaveProperty('earnedBadges');
      expect(res.body.earnedBadges).toContain('first_session');
      expect(res.body).toHaveProperty('skillFreshness');
      expect(res.body).toHaveProperty('journal');
      expect(Array.isArray(res.body.journal)).toBe(true);
    });

    it('should return 404 for non-existent dog', async () => {
      await request(app.getHttpServer())
        .get('/api/training/progress/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/training/progress/${dogId}`)
        .expect(401);
    });
  });

  describe('GET /api/training/skill-health/:dogId', () => {
    it('should return skill health for a dog', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/training/skill-health/${dogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const skill = res.body[0];
      expect(skill).toHaveProperty('exerciseId');
      expect(skill).toHaveProperty('score');
      expect(skill).toHaveProperty('label');
      expect(['fresh', 'fading', 'stale']).toContain(skill.label);
      expect(skill).toHaveProperty('lastCompleted');
      expect(skill).toHaveProperty('interval');
      expect(skill).toHaveProperty('completions');
    });
  });

  describe('Full training flow', () => {
    let flowToken: string;
    let flowDogId: string;

    beforeAll(async () => {
      // Register a fresh user
      const regRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'fullflow@pawpath.com', name: 'Flow User', password: 'password123' });
      flowToken = regRes.body.accessToken;

      // Create a dog
      const dogRes = await request(app.getHttpServer())
        .post('/api/dogs')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({ name: 'Max', breed: 'Labrador', weight: 25 });
      flowDogId = dogRes.body.id;
    });

    it('should complete register -> create dog -> train -> check progress', async () => {
      // Complete first exercise
      const completeRes = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({
          dogId: flowDogId,
          exerciseId: 'f1a',
          levelId: 'f1',
          programId: 'foundations',
          journal: { note: 'First session!', rating: 4 },
        })
        .expect(201);

      expect(completeRes.body.xpGained).toBeGreaterThan(0);
      expect(completeRes.body.newStreak).toBe(1);
      expect(completeRes.body.newBadges).toContain('first_session');

      // Complete second exercise
      const secondRes = await request(app.getHttpServer())
        .post('/api/training/complete-exercise')
        .set('Authorization', `Bearer ${flowToken}`)
        .send({
          dogId: flowDogId,
          exerciseId: 'f1b',
          levelId: 'f1',
          programId: 'foundations',
        })
        .expect(201);

      expect(secondRes.body.totalSessions).toBe(2);
      expect(secondRes.body.completedExercises).toContain('f1a');
      expect(secondRes.body.completedExercises).toContain('f1b');

      // Check progress
      const progressRes = await request(app.getHttpServer())
        .get(`/api/training/progress/${flowDogId}`)
        .set('Authorization', `Bearer ${flowToken}`)
        .expect(200);

      expect(progressRes.body.totalXP).toBeGreaterThan(0);
      expect(progressRes.body.completedExercises).toContain('f1a');
      expect(progressRes.body.completedExercises).toContain('f1b');
      expect(progressRes.body.totalSessions).toBe(2);
      expect(progressRes.body.earnedBadges).toContain('first_session');

      // Journal entry should exist (from first exercise with journal data)
      expect(progressRes.body.journal.length).toBe(1);
      expect(progressRes.body.journal[0].note).toBe('First session!');
      expect(progressRes.body.journal[0].rating).toBe(4);

      // Skill health should have entries for both exercises
      const healthRes = await request(app.getHttpServer())
        .get(`/api/training/skill-health/${flowDogId}`)
        .set('Authorization', `Bearer ${flowToken}`)
        .expect(200);

      expect(healthRes.body.length).toBe(2);
      const exerciseIds = healthRes.body.map((s: any) => s.exerciseId);
      expect(exerciseIds).toContain('f1a');
      expect(exerciseIds).toContain('f1b');
    });
  });
});
