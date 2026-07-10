import { createContext, useContext, useState } from "react";
import { useCart } from "./CartContext.jsx";
import { customerApi } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { clearCart } = useCart();
  
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("store_user") || "null"); }
    catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem("store_token", token);
    localStorage.setItem("store_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("store_token");
    localStorage.removeItem("store_user");
    clearCart();
    setUser(null);
  };

  const updateUser = async (data) => {
    try {
      const updated = await customerApi.updateProfile(data);
      const newUser = { ...user, ...updated };
      localStorage.setItem("store_user", JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const refreshUser = (userData) => {
    localStorage.setItem("store_user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);