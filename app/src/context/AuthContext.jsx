import { createContext, useContext, useState } from "react";
import { connectSocket } from "../socket";
import { useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    socket.on("connect", () => {
      console.log("socket connected with id-> ", socket.id);
    });
  });

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
