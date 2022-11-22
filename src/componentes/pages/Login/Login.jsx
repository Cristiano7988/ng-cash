import { useState, useContext } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Login = () => {
  const [acesso, setAcesso] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAcesso({
      ...acesso,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(acesso);
  };

  return (
    <section>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            required
            onChange={handleChange}
          />
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
          <button type="submit">Enter</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
