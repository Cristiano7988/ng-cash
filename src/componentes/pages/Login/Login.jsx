import { ThemeContext } from "@emotion/react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Login = () => {
  const [acesso, setAcesso] = useState({ username: "", password: "" });
  const { palette } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAcesso({
      ...acesso,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    login(acesso)
    .then(r => setLoading(false))
    .catch(() => setLoading(false))
  };

  return (
    <section>
      <Typography
        component="h1"
        variant="h4"
        children="Login"
      />

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
            children={loading ? <CircularProgress style={{ width: 30, height: 30, color: palette.text.primary }} /> : "Enter" }
          />
        </div>
      </form>
    </section>
  );
};

export default Login;
