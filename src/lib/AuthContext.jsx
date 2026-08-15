import React, { createContext, useState, useContext, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);

  useEffect(() => {
    let mounted = true;
    base44.auth
      .me()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        const msg = String(e?.message || e || "").toLowerCase();
        if (msg.includes("not registered") || msg.includes("usernotregistered") || msg.includes("no user")) {
          setNotRegistered(true);
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, notRegistered, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};