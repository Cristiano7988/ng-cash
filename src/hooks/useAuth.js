import axios from "axios";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { useMessage } from "./useMessage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  const {message, displayMessage} = useMessage();
  const navigate = useNavigate();

  // Loga o usuário
  const login = async (acesso) => {
    const { data } = await axios.post("/api/auth/signin", acesso)
    .catch(r => ({ data: { message: { content: r.message, status: false } }}));
    const { message, user } = data;

    displayMessage(message);
  
    if (message.status) {
      setUser(user);
      navigate('/dashboard/profile');
      return true;
    }
    return false;
  };

  // Desloga o usuário
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      message,
      displayMessage,
      login,
      logout
    }),
    [user, message]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
