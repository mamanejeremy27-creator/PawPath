import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getToken, setToken, clearToken, getAuthHeaders, apiLogin, apiRegister, getCurrentUser } from './auth.js';

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Token management ───

  describe('getToken', () => {
    it('returns null when no token stored', () => {
      expect(getToken()).toBeNull();
    });

    it('returns token from localStorage', () => {
      localStorage.setItem('pawpath_token', 'abc123');
      expect(getToken()).toBe('abc123');
    });
  });

  describe('setToken', () => {
    it('stores token in localStorage', () => {
      setToken('xyz789');
      expect(localStorage.getItem('pawpath_token')).toBe('xyz789');
    });

    it('overwrites existing token', () => {
      setToken('first');
      setToken('second');
      expect(localStorage.getItem('pawpath_token')).toBe('second');
    });
  });

  describe('clearToken', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem('pawpath_token', 'abc');
      clearToken();
      expect(localStorage.getItem('pawpath_token')).toBeNull();
    });

    it('does not throw when no token exists', () => {
      expect(() => clearToken()).not.toThrow();
    });
  });

  describe('getAuthHeaders', () => {
    it('returns Authorization header with Bearer token when token exists', () => {
      setToken('mytoken');
      expect(getAuthHeaders()).toEqual({ Authorization: 'Bearer mytoken' });
    });

    it('returns empty object when no token', () => {
      expect(getAuthHeaders()).toEqual({});
    });
  });

  // ─── API functions ───

  describe('apiLogin', () => {
    it('calls /api/auth/login with email and password', async () => {
      const mockResponse = { accessToken: 'tok123', user: { id: 1 } };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as Response);

      const result = await apiLogin('test@example.com', 'pass123');

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'pass123' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('stores the accessToken on successful login', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accessToken: 'stored_token' }),
      } as unknown as Response);

      await apiLogin('test@example.com', 'pass');
      expect(getToken()).toBe('stored_token');
    });

    it('throws on failed login with server message', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      } as unknown as Response);

      await expect(apiLogin('bad@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    it('throws generic message when server returns no message', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('parse error')),
      } as unknown as Response);

      await expect(apiLogin('bad@example.com', 'wrong')).rejects.toThrow('Login failed');
    });
  });

  describe('apiRegister', () => {
    it('calls /api/auth/register with email, password, and name', async () => {
      const mockResponse = { accessToken: 'reg_tok', user: { id: 2 } };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as Response);

      const result = await apiRegister('new@example.com', 'pass123', 'Tsuf');

      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'new@example.com', password: 'pass123', name: 'Tsuf' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('stores the accessToken on successful registration', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accessToken: 'new_token' }),
      } as unknown as Response);

      await apiRegister('new@example.com', 'pass', 'Name');
      expect(getToken()).toBe('new_token');
    });

    it('throws on failed registration', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Email taken' }),
      } as unknown as Response);

      await expect(apiRegister('dup@example.com', 'pass', 'Name')).rejects.toThrow('Email taken');
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no token exists', async () => {
      const result = await getCurrentUser();
      expect(result).toBeNull();
    });

    it('fetches /api/auth/me with Authorization header', async () => {
      setToken('my_token');
      const mockUser = { id: 1, email: 'test@example.com' };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      } as unknown as Response);

      const result = await getCurrentUser();

      expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
        headers: { Authorization: 'Bearer my_token' },
      });
      expect(result).toEqual(mockUser);
    });

    it('clears token and returns null on non-ok response', async () => {
      setToken('expired_token');
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
      } as unknown as Response);

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(getToken()).toBeNull();
    });
  });
});
