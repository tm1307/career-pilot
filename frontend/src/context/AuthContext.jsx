import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("cp_token")) { setLoading(false); return; }
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("cp_token"))
      .finally(() => setLoading(false));
  }, []);

  const storeSession = (token, u) => { localStorage.setItem("cp_token", token); setUser(u); };
  const logout       = ()         => { localStorage.removeItem("cp_token"); setUser(null); };
  const updateUser   = (updates)  => setUser((u) => ({ ...u, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, storeSession, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
