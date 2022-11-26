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
import Transactions from "../componentes/pages/Transactions";
import Extract from "../componentes/pages/Extract";
import Error from "../componentes/pages/Error";

function logout() {
  localStorage.removeItem("user");
  window.location.pathname = "/login";
}

// Testa validade do token de acesso
const getUserData = () => {
  new Promise((resolve) => {
    const userInStorage = localStorage.getItem("user");
    if (!userInStorage || ["undefined", "null"].includes(userInStorage)) return;
    const { accessToken } = JSON.parse(userInStorage);
    const headers = { "x-access-token": accessToken };

    fetch("/api/test/user", { headers })
    .then((r) => {
      if (r.status === 200) return r.json();
      logout();
    })
    .then((r) => {
      if (r.message.status) {
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
        <Route path="*" element={<Error />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="extract" element={<Extract />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Route>
  )
);
