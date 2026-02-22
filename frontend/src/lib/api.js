import { getAuthHeaders, clearToken } from './auth.js';

const API_BASE = '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearToken();
    window.location.reload();
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
  upload: async (path, formData) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    return res.json();
  },

  // Training
  completeExercise: (data) => apiFetch('/training/complete-exercise', { method: 'POST', body: JSON.stringify(data) }),
  getProgress: (dogId) => apiFetch(`/training/progress/${dogId}`),
  getSkillHealth: (dogId) => apiFetch(`/training/skill-health/${dogId}`),

  // Dogs
  getDogs: () => apiFetch('/dogs'),
  createDog: (data) => apiFetch('/dogs', { method: 'POST', body: JSON.stringify(data) }),
  updateDog: (id, data) => apiFetch(`/dogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDog: (id) => apiFetch(`/dogs/${id}`, { method: 'DELETE' }),
  uploadDogPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch(`${API_BASE}/dogs/${id}/photo`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    return res.json();
  },

  // Settings
  getSettings: () => apiFetch('/settings'),
  updateSettings: (data) => apiFetch('/settings', { method: 'PATCH', body: JSON.stringify(data) }),

  // Health
  getWeightRecords: (dogId) => apiFetch(`/health/weight/${dogId}`),
  addWeightRecord: (dogId, data) => apiFetch('/health/weight', { method: 'POST', body: JSON.stringify({ dogId, ...data }) }),
  deleteWeightRecord: (id) => apiFetch(`/health/weight/${id}`, { method: 'DELETE' }),
  getVaccinations: (dogId) => apiFetch(`/health/vaccinations/${dogId}`),
  addVaccination: (dogId, data) => apiFetch('/health/vaccinations', { method: 'POST', body: JSON.stringify({ dogId, ...data }) }),
  deleteVaccination: (id) => apiFetch(`/health/vaccinations/${id}`, { method: 'DELETE' }),
  getVetVisits: (dogId) => apiFetch(`/health/vet-visits/${dogId}`),
  addVetVisit: (dogId, data) => apiFetch('/health/vet-visits', { method: 'POST', body: JSON.stringify({ dogId, ...data }) }),
  deleteVetVisit: (id) => apiFetch(`/health/vet-visits/${id}`, { method: 'DELETE' }),
  getMedications: (dogId) => apiFetch(`/health/medications/${dogId}`),
  addMedication: (dogId, data) => apiFetch('/health/medications', { method: 'POST', body: JSON.stringify({ dogId, ...data }) }),
  deleteMedication: (id) => apiFetch(`/health/medications/${id}`, { method: 'DELETE' }),

  // Walks
  getWalks: (dogId) => apiFetch(`/walks/${dogId}`),
  saveWalk: (data) => apiFetch('/walks', { method: 'POST', body: JSON.stringify(data) }),
  deleteWalk: (id) => apiFetch(`/walks/${id}`, { method: 'DELETE' }),

  // Community
  getPosts: (page = 1) => apiFetch(`/community/posts?page=${page}`),
  createPost: (data) => apiFetch('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  toggleLike: (postId) => apiFetch(`/community/posts/${postId}/like`, { method: 'POST' }),
  getComments: (postId) => apiFetch(`/community/posts/${postId}/comments`),
  addComment: (postId, data) => apiFetch(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  // Leaderboard
  getWeeklyLeaderboard: () => apiFetch('/leaderboard/weekly'),
  getAllTimeLeaderboard: () => apiFetch('/leaderboard/all-time'),
  getBreedLeaderboard: (breed) => apiFetch(`/leaderboard/breed/${encodeURIComponent(breed)}`),

  // Buddies
  getBuddies: () => apiFetch('/buddies'),
  sendBuddyRequest: (toUserId) => apiFetch('/buddies/request', { method: 'POST', body: JSON.stringify({ toUserId }) }),
  acceptBuddy: (id) => apiFetch(`/buddies/${id}/accept`, { method: 'PATCH' }),
  rejectBuddy: (id) => apiFetch(`/buddies/${id}/reject`, { method: 'PATCH' }),
  removeBuddy: (id) => apiFetch(`/buddies/${id}`, { method: 'DELETE' }),

  // Lost Dogs
  getLostDogReports: () => apiFetch('/lost-dogs'),
  createLostDogReport: (data) => apiFetch('/lost-dogs', { method: 'POST', body: JSON.stringify(data) }),
  updateLostDogReport: (id, data) => apiFetch(`/lost-dogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  addSighting: (reportId, data) => apiFetch(`/lost-dogs/${reportId}/sightings`, { method: 'POST', body: JSON.stringify(data) }),
  getPublicLostDog: async (shareToken) => {
    const res = await fetch(`${API_BASE}/lost-dogs/public/${shareToken}`);
    if (!res.ok) return null;
    return res.json();
  },

  // Feedback
  submitFeedback: (data) => apiFetch('/feedback', { method: 'POST', body: JSON.stringify(data) }),
  getFeedback: () => apiFetch('/feedback'),

  // Journal (standalone)
  getJournal: (dogId) => apiFetch(`/training/progress/${dogId}`).then(p => p.journal || []),

  // Photo upload (generic)
  uploadPhoto: async (dogId, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch(`${API_BASE}/dogs/${dogId}/photo`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    const data = await res.json();
    return data.url || data.path;
  },
};
