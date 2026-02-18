import { useState, useEffect } from "react";
import { clearToken, getCurrentUser } from "../lib/auth.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signOut = () => {
    clearToken();
    setUser(null);
    window.location.reload();
  };

  const refreshUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    return user;
  };

  return {
    user,
    loading,
    signOut,
    refreshUser,
    session: user ? { user } : null,
  };
}
