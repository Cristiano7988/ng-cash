import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";
import Login from "../componentes/pages/Login";
import Profile from "../componentes/pages/Profile";
import AuthLayout from "../componentes/AuthLayout";
import ProtectedLayout from "../componentes/ProtectedLayout";
import HomeLayout from "../componentes/HomeLayout";
import Cadastro from "../componentes/pages/Cadastro";
import Home from "../componentes/pages/Home";

function logout() {
  localStorage.removeItem("user");
  window.location.pathname = "/login";
}

// Testa validade do token de acesso
const getUserData = () => {
  new Promise((resolve) => {
    const user = localStorage.getItem("user");
    if (!user || ["undefined", "null"].includes(user)) return;
    const { accessToken } = JSON.parse(user);

    fetch("/api/test/user", {
      headers: {
        "x-access-token": accessToken,
      }
    })
    .then((r) => {
      if (r.status === 200) return r.json();
      logout();
    })
    .then((r) => {
      if (r.status) {
        const user = localStorage.getItem("user");
        return resolve(user);
      } 
      logout();
    })
    .catch(() => logout());
  });
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  )
);
