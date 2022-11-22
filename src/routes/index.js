import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";
import Login from "../componentes/pages/Login";
import Dashboard from "../componentes/pages/Dashboard";
import AuthLayout from "../componentes/AuthLayout";
import ProtectedLayout from "../componentes/ProtectedLayout";
import HomeLayout from "../componentes/HomeLayout";
import Cadastro from "../componentes/pages/Cadastro";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<>Home</>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<Dashboard />} />
      </Route>
    </Route>
  )
);
