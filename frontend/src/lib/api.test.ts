import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { api } from './api.js';
import { setToken, clearToken, getToken } from './auth.js';

describe('api.js', () => {
  let fetchMock;
  const reloadMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as unknown as Response);

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true,
    });
    reloadMock.mockClear();
  });

  // ─── HTTP method helpers ───

  describe('api.get', () => {
    it('sends GET to the correct URL with auth headers', async () => {
      setToken('tok');
      await api.get('/dogs');

      expect(fetchMock).toHaveBeenCalledWith('/api/dogs', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok',
        },
      });
    });

    it('sends GET without Authorization when no token', async () => {
      await api.get('/settings');

      expect(fetchMock).toHaveBeenCalledWith('/api/settings', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('api.post', () => {
    it('sends POST with JSON body', async () => {
      setToken('tok');
      await api.post('/dogs', { name: 'Rex' });

      expect(fetchMock).toHaveBeenCalledWith('/api/dogs', {
        method: 'POST',
        body: JSON.stringify({ name: 'Rex' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok',
        },
      });
    });
  });

  describe('api.patch', () => {
    it('sends PATCH with JSON body', async () => {
      setToken('tok');
      await api.patch('/dogs/1', { name: 'Updated' });

      expect(fetchMock).toHaveBeenCalledWith('/api/dogs/1', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok',
        },
      });
    });
  });

  describe('api.delete', () => {
    it('sends DELETE request', async () => {
      setToken('tok');
      await api.delete('/dogs/1');

      expect(fetchMock).toHaveBeenCalledWith('/api/dogs/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok',
        },
      });
    });
  });

  // ─── Response handling ───

  describe('response handling', () => {
    it('returns parsed JSON for successful responses', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1, name: 'Rex' }),
      } as unknown as Response);

      const result = await api.get('/dogs');
      expect(result).toEqual({ id: 1, name: 'Rex' });
    });

    it('returns null for 204 No Content responses', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error('No content')),
      } as unknown as Response);

      const result = await api.delete('/dogs/1');
      expect(result).toBeNull();
    });
  });

  // ─── 401 Unauthorized handling ───

  describe('401 handling', () => {
    it('clears token on 401 response', async () => {
      setToken('expired');
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      } as unknown as Response);

      await expect(api.get('/dogs')).rejects.toThrow('Unauthorized');
      expect(getToken()).toBeNull();
    });

    it('calls window.location.reload on 401', async () => {
      setToken('expired');
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      } as unknown as Response);

      await expect(api.get('/dogs')).rejects.toThrow();
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  // ─── Error handling ───

  describe('error handling', () => {
    it('throws with server error message on non-ok response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad input' }),
      } as unknown as Response);

      await expect(api.post('/dogs', {})).rejects.toThrow('Bad input');
    });

    it('throws generic message when server returns no message', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('parse error')),
      } as unknown as Response);

      await expect(api.get('/dogs')).rejects.toThrow('Request failed: 500');
    });
  });

  // ─── Named API methods ───

  describe('named API methods', () => {
    beforeEach(() => {
      setToken('tok');
    });

    it('getDogs calls GET /dogs', async () => {
      await api.getDogs();
      expect(fetchMock).toHaveBeenCalledWith('/api/dogs', expect.objectContaining({}));
    });

    it('createDog calls POST /dogs with data', async () => {
      await api.createDog({ name: 'Rex', breed: 'Labrador' });
      expect(fetchMock).toHaveBeenCalledWith('/api/dogs', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Rex', breed: 'Labrador' }),
      }));
    });

    it('updateDog calls PATCH /dogs/:id', async () => {
      await api.updateDog(5, { name: 'Rex Jr' });
      expect(fetchMock).toHaveBeenCalledWith('/api/dogs/5', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ name: 'Rex Jr' }),
      }));
    });

    it('deleteDog calls DELETE /dogs/:id', async () => {
      await api.deleteDog(5);
      expect(fetchMock).toHaveBeenCalledWith('/api/dogs/5', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('getSettings calls GET /settings', async () => {
      await api.getSettings();
      expect(fetchMock).toHaveBeenCalledWith('/api/settings', expect.objectContaining({}));
    });

    it('completeExercise calls POST /training/complete-exercise', async () => {
      await api.completeExercise({ exerciseId: 'sit', dogId: 1 });
      expect(fetchMock).toHaveBeenCalledWith('/api/training/complete-exercise', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ exerciseId: 'sit', dogId: 1 }),
      }));
    });

    it('getProgress calls GET /training/progress/:dogId', async () => {
      await api.getProgress(3);
      expect(fetchMock).toHaveBeenCalledWith('/api/training/progress/3', expect.objectContaining({}));
    });

    it('getPosts calls GET /community/posts with page param', async () => {
      await api.getPosts(2);
      expect(fetchMock).toHaveBeenCalledWith('/api/community/posts?page=2', expect.objectContaining({}));
    });

    it('getPosts defaults to page 1', async () => {
      await api.getPosts();
      expect(fetchMock).toHaveBeenCalledWith('/api/community/posts?page=1', expect.objectContaining({}));
    });

    it('toggleLike calls POST /community/posts/:id/like', async () => {
      await api.toggleLike(10);
      expect(fetchMock).toHaveBeenCalledWith('/api/community/posts/10/like', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('getWeeklyLeaderboard calls GET /leaderboard/weekly', async () => {
      await api.getWeeklyLeaderboard();
      expect(fetchMock).toHaveBeenCalledWith('/api/leaderboard/weekly', expect.objectContaining({}));
    });

    it('getBreedLeaderboard encodes breed name', async () => {
      await api.getBreedLeaderboard('German Shepherd');
      expect(fetchMock).toHaveBeenCalledWith('/api/leaderboard/breed/German%20Shepherd', expect.objectContaining({}));
    });

    it('sendBuddyRequest calls POST /buddies/request', async () => {
      await api.sendBuddyRequest(42);
      expect(fetchMock).toHaveBeenCalledWith('/api/buddies/request', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ toUserId: 42 }),
      }));
    });

    it('getLostDogReports calls GET /lost-dogs', async () => {
      await api.getLostDogReports();
      expect(fetchMock).toHaveBeenCalledWith('/api/lost-dogs', expect.objectContaining({}));
    });

    it('submitFeedback calls POST /feedback', async () => {
      await api.submitFeedback({ rating: 5, text: 'Great app' });
      expect(fetchMock).toHaveBeenCalledWith('/api/feedback', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ rating: 5, text: 'Great app' }),
      }));
    });
  });

  // ─── Public endpoints (no auth) ───

  describe('getPublicLostDog', () => {
    it('fetches public lost dog without auth headers', async () => {
      const report = { id: 1, dogName: 'Buddy', status: 'lost' };
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(report),
      } as unknown as Response);

      const result = await api.getPublicLostDog('share123');

      expect(fetchMock).toHaveBeenCalledWith('/api/lost-dogs/public/share123');
      expect(result).toEqual(report);
    });

    it('returns null when public lost dog not found', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
      } as unknown as Response);

      const result = await api.getPublicLostDog('invalid');
      expect(result).toBeNull();
    });
  });

  // ─── Upload methods ───

  describe('api.upload', () => {
    it('sends POST with FormData and auth headers (no Content-Type)', async () => {
      setToken('tok');
      const formData = new FormData();
      formData.append('file', 'data');

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ url: '/uploads/photo.jpg' }),
      } as unknown as Response);

      const result = await api.upload('/some/upload', formData);

      expect(fetchMock).toHaveBeenCalledWith('/api/some/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer tok' },
        body: formData,
      });
      expect(result).toEqual({ url: '/uploads/photo.jpg' });
    });

    it('throws on upload failure', async () => {
      setToken('tok');
      fetchMock.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'File too large' }),
      } as unknown as Response);

      await expect(api.upload('/some/upload', new FormData())).rejects.toThrow('File too large');
    });
  });

  describe('uploadDogPhoto', () => {
    it('sends photo upload to /dogs/:id/photo', async () => {
      setToken('tok');
      const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ url: '/uploads/dog1.jpg' }),
      } as unknown as Response);

      const result = await api.uploadDogPhoto(1, file);

      expect(fetchMock).toHaveBeenCalledWith('/api/dogs/1/photo', {
        method: 'POST',
        headers: { Authorization: 'Bearer tok' },
        body: expect.any(FormData),
      });
      expect(result).toEqual('/uploads/dog1.jpg');
    });
  });
});
