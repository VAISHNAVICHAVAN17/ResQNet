import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userRole: null,
    userId: null,
    token: null,
  });

  // On mount, load auth info from localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (isLoggedIn && userRole && token && userId) {
      setAuth({ isLoggedIn, userRole, userId, token });
    }
  }, []);

  // Save to localStorage on auth change
  useEffect(() => {
    localStorage.setItem("isLoggedIn", auth.isLoggedIn);
    if (auth.userRole) localStorage.setItem("userRole", auth.userRole);
    else localStorage.removeItem("userRole");
    if (auth.userId) localStorage.setItem("userId", auth.userId);
    else localStorage.removeItem("userId");
    if (auth.token) localStorage.setItem("token", auth.token);
    else localStorage.removeItem("token");
  }, [auth]);

  const login = ({ userRole, userId, token }) => setAuth({ isLoggedIn: true, userRole, userId, token });
  const logout = () => setAuth({ isLoggedIn: false, userRole: null, userId: null, token: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
