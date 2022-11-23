import { ThemeContext } from "@emotion/react";
import { Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
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
  const { palette } = useContext(ThemeContext);

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
      <Typography variant="h4" component="h1">
        Cadastro
      </Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            className="text-field"
            label="Username"
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
        {!!validaCadastro() && <div style={{ background: palette.background.default, display: 'inline-block', margin: '24px 0', padding: 24, borderRadius: 6 }}>
          <List disablePadding>
            {alerta.tamanho.usuario && (
              <>
                <ListItem disablePadding className="alerta">
                  <ListItemText>Usuário deve ter no mínimo:</ListItemText>
                </ListItem>
                <List disablePadding>
                  <ListItem
                    disablePadding
                    sx={{ pl: 4 }}
                    className="alerta"
                  >
                    <ListItemText>
                      3 caracteres
                    </ListItemText>
                  </ListItem>
                </List>
              </>
            )}
            {(alerta.tamanho.senha ||
              alerta.ausencia.letraMaiuscula ||
              alerta.ausencia.numero) && (
                <>
                  <ListItem disablePadding className="alerta">
                    <ListItemText>Senha deve ter no mínimo:</ListItemText>
                  </ListItem>
                  <List disablePadding>
                    {alerta.tamanho.senha && (
                      <ListItem
                        disablePadding
                        sx={{ pl: 4 }}
                        className="alerta"
                      >
                        <ListItemText>
                          8 caracteres
                        </ListItemText>
                      </ListItem>
                    )}
                    {alerta.ausencia.letraMaiuscula && (
                      <ListItem
                        disablePadding
                        sx={{ pl: 4 }}
                        className="alerta"
                      >
                        <ListItemText>
                          1 letra maiúscula
                        </ListItemText>
                      </ListItem>
                    )}
                    {alerta.ausencia.numero && (
                      <ListItem
                        disablePadding
                        sx={{ pl: 4 }}
                        className="alerta"
                      >
                        <ListItemText>
                          1 número
                        </ListItemText>
                      </ListItem>
                    )}
                  </List>
                </>
              )}
          </List>
        </div>}
        <div>
        <Button
            style={{
              background: palette.background.default,
              color: palette.text.primary
            }}
            variant="contained"
            type="submit"
            children="Cadastrar"
          />
        </div>
      </form>
    </section>
  );
};

export default Cadastro;
