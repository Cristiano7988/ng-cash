import { ThemeContext } from "@emotion/react";
import { Button, TextField, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Login = () => {
  const [acesso, setAcesso] = useState({ username: "", password: "" });
  const { palette } = useContext(ThemeContext);
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
      <Typography variant="h4" component="h1">
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <TextField
              className="text-field"
              label="Username"
              variant="outlined"
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              className="text-field"
              label="Password"
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <Button
            style={{
              background: palette.background.default,
              color: palette.text.primary
            }}
            variant="contained"
            type="submit"
            children="Enter"
          />
        </div>
      </form>
    </section>
  );
};

export default Login;
