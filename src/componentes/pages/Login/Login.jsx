import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = login;
    const { status, data } = await axios
      .post("http://localhost:8080/api/auth/signin", {
        username,
        password,
      })
      .catch((err) => {
        console.log(err);
      });

      if (status === 200) {
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        navigate("/");
      }
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
