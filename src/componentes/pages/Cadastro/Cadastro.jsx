import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const navigate = useNavigate();
  const [cadastro, setCadastro] = useState({ username: "", password: "" });
  const [alerta, setAlerta] = useState({
    tamanho: {
      usuario: true,
      senha: true,
    },
    ausencia: {
      letraMaiuscula: true,
      numero: true,
    },
  });

  const validaCadastro = () => Object.values(alerta).map(item =>
    Object.values(item).filter(Boolean).length
  ).filter(Boolean).length

  const handleChange = (e) => {
    const alertar = alerta;
    const { name, value } = e.target;
    const hasUpperCase = (texto) => /[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/.test(texto);
    const hasNumber = (texto) => !/[0-9]/.test(texto);

    if (e.target.name === "password") {
      alertar.tamanho.senha = value.length <= 7;
      alertar.ausencia.letraMaiuscula = !hasUpperCase(value);
      if (typeof parseInt(value.split("").pop()) === "number") alertar.ausencia.numero = hasNumber(value);
    } else alertar.tamanho.usuario = value.length <= 2;

    setAlerta({ ...alertar });

    setCadastro({
      ...cadastro,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = cadastro;

      if (validaCadastro()) return;

    const { status, data } = await axios
      .post("http://localhost:8080/api/auth/signup", {
        username,
        password,
      })
      .catch((err) => {
        console.log(err);
      });

    if (status === 200 && data.status) navigate("/");
  };

  return (
    <section>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <ul>
            {alerta.tamanho.usuario && (
              <li className="alerta">
                <span>Usuário deve ter no mínimo:</span>
                <ul>
                  <li className="alerta">3 caracteres</li>
                </ul>
              </li>
            )}
            {(alerta.tamanho.senha ||
              alerta.ausencia.letraMaiuscula ||
              alerta.ausencia.numero) && (
                <li className="alerta">
                  <span>Senha deve ter no mínimo:</span>
                  <ul>
                    {alerta.tamanho.senha && (
                      <li className="alerta">8 caracteres</li>
                    )}
                    {alerta.ausencia.letraMaiuscula && (
                      <li className="alerta">1 letra maiúscula</li>
                    )}
                    {alerta.ausencia.numero && (
                      <li className="alerta">1 número</li>
                    )}
                  </ul>
                </li>
              )}
          </ul>
        </div>
        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </section>
  );
};

export default Cadastro;
