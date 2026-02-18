import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { createTestApp } from './setup';

describe('Dogs (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let tokenA: string;
  let tokenB: string;
  let userAId: string;
  let dogId: string;

  beforeAll(async () => {
    ({ app, module } = await createTestApp());

    // Register user A
    const resA = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'usera@pawpath.com', name: 'User A', password: 'password123' });
    tokenA = resA.body.accessToken;
    userAId = resA.body.user.id;

    // Register user B
    const resB = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'userb@pawpath.com', name: 'User B', password: 'password123' });
    tokenB = resB.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/dogs', () => {
    it('should create a dog for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/dogs')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Rex', breed: 'German Shepherd', weight: 30 })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Rex');
      expect(res.body.breed).toBe('German Shepherd');
      expect(res.body.weight).toBe(30);
      expect(res.body.userId).toBe(userAId);
      dogId = res.body.id;
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/dogs')
        .send({ name: 'Buddy' })
        .expect(401);
    });

    it('should create a dog with minimal fields (name only)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/dogs')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Buddy' })
        .expect(201);

      expect(res.body.name).toBe('Buddy');
    });
  });

  describe('GET /api/dogs', () => {
    it('should list all dogs for the authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dogs')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Rex + Buddy (at least)
      expect(res.body[0].userId).toBe(userAId);
    });

    it('should return empty array for user with no dogs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dogs')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/dogs')
        .expect(401);
    });
  });

  describe('GET /api/dogs/:id', () => {
    it('should return a specific dog by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/dogs/${dogId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.id).toBe(dogId);
      expect(res.body.name).toBe('Rex');
    });

    it('should return 404 for non-existent dog', async () => {
      await request(app.getHttpServer())
        .get('/api/dogs/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);
    });

    it('should return 404 when user B tries to access user A dog (ownership)', async () => {
      await request(app.getHttpServer())
        .get(`/api/dogs/${dogId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });
  });

  describe('PATCH /api/dogs/:id', () => {
    it('should update a dog', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/dogs/${dogId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Rex Updated', weight: 32 })
        .expect(200);

      expect(res.body.name).toBe('Rex Updated');
      expect(res.body.weight).toBe(32);
    });

    it('should return 404 when updating non-existent dog', async () => {
      await request(app.getHttpServer())
        .patch('/api/dogs/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Ghost' })
        .expect(404);
    });

    it('should return 404 when user B tries to update user A dog', async () => {
      await request(app.getHttpServer())
        .patch(`/api/dogs/${dogId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ name: 'Hacked' })
        .expect(404);
    });
  });

  describe('DELETE /api/dogs/:id', () => {
    let deletableDogId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/dogs')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'ToDelete' });
      deletableDogId = res.body.id;
    });

    it('should return 404 when user B tries to delete user A dog', async () => {
      await request(app.getHttpServer())
        .delete(`/api/dogs/${deletableDogId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });

    it('should delete a dog', async () => {
      await request(app.getHttpServer())
        .delete(`/api/dogs/${deletableDogId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      // Verify it's gone
      await request(app.getHttpServer())
        .get(`/api/dogs/${deletableDogId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent dog', async () => {
      await request(app.getHttpServer())
        .delete('/api/dogs/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);
    });
  });
});
