import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth.js';

// Mock the auth module
vi.mock('../lib/auth.js', () => ({
  getCurrentUser: vi.fn(),
  clearToken: vi.fn(),
}));

import { getCurrentUser, clearToken } from '../lib/auth.js';

describe('useAuth', () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true,
    });
    reloadMock.mockClear();
  });

  it('starts with loading=true and user=null', () => {
    (getCurrentUser as any).mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('sets user when getCurrentUser resolves with data', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Tsuf' };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual({ user: mockUser });
  });

  it('sets user to null when getCurrentUser resolves with null', async () => {
    (getCurrentUser as any).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('sets user to null when getCurrentUser rejects', async () => {
    (getCurrentUser as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('signOut clears token, sets user null, and reloads', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (getCurrentUser as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.signOut();
    });

    expect(clearToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(reloadMock).toHaveBeenCalled();
  });

  it('refreshUser re-fetches the current user', async () => {
    (getCurrentUser as any).mockResolvedValueOnce({ id: 1, name: 'Old' });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedUser = { id: 1, name: 'Updated' };
    (getCurrentUser as any).mockResolvedValueOnce(updatedUser);

    let refreshResult;
    await act(async () => {
      refreshResult = await result.current.refreshUser();
    });

    expect(result.current.user).toEqual(updatedUser);
    expect(refreshResult).toEqual(updatedUser);
  });
});
