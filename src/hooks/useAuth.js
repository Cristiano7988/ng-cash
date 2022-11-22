import axios from "axios";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  const navigate = useNavigate();

  // Loga o usuário
  const login = async ({ username, password }) => {
    const { status, data } = await axios
      .post("http://localhost:8080/api/auth/signin", {
        username,
        password,
      })
      .catch((err) => {
        console.log(err);
      });

      if (status === 200) {
        setUser(data);
        navigate('/dashboard/profile');
      }
  };

  // Desloga o usuário
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
