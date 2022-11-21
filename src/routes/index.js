import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cadastro from "../componentes/pages/Cadastro";
import Login from "../componentes/pages/Login";

const RouteElement = () => (
  <Router>
    <Routes>
      <Route path="/" element={<>Home</>} />
      <Route path={"/cadastro"} exact element={<Cadastro />} />
      <Route path={"/login"} exact element={<Login />} />
      <Route path="*" element={<>ErrorPage</>} />
    </Routes>
  </Router>
);

export default RouteElement;
