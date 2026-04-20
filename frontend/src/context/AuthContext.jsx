import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await getProfile();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    const { data } = await loginUser(formData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      fetchUser,
    }),
    [user, isAuthenticated, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
