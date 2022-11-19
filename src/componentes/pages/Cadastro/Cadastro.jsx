import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const navigate = useNavigate();
  const [cadastro, setCadastro] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCadastro({
      ...cadastro,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = cadastro;

    const { status, data } = await axios
      .post("http://localhost:8080/api/users", {
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
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </section>
  );
};

export default Cadastro;
