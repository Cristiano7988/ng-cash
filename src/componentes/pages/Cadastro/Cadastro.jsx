import { ThemeContext } from "@emotion/react";
import { Button, CircularProgress, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Cadastro = () => {
  const [cadastro, setCadastro] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
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
  const { login, displayMessage } = useContext(AuthContext);
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

  const postUser = async () => {
    if (validaCadastro()) return;
    setLoading(true)

    const { data } = await axios.post("http://localhost:8080/api/auth/signup", cadastro)
    .catch(r => ({ data: { message: { content: r.message, status: false } }}));
    const { message, user } = data;

    if (message.status) login(user);
    
    setLoading(false);
    displayMessage(message);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    postUser();
  };

  return (
    <section>
      <Typography
        component="h1"
        variant="h4"
        children="Cadastro"
      />
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
            {
              (
                alerta.tamanho.senha ||
                alerta.ausencia.letraMaiuscula ||
                alerta.ausencia.numero
              ) && (
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
              )
            }
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
            children={loading ? <CircularProgress style={{ width: 30, height: 30, color: palette.text.primary }} /> : "Cadastrar"}
          />
        </div>
      </form>
    </section>
  );
};

export default Cadastro;
