import { ThemeContext } from "@emotion/react";
import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const { palette } = useContext(ThemeContext);
  const [transaction, setTransaction] = useState({ username: null, value: null });
  const { account_id } = user.user;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'value') value = parseFloat(value).toFixed(2);

    setTransaction({
      ...transaction,
      [name]: value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`/api/accounts/${account_id}/transactions/cash-out/`, {
      username: transaction.username,
      value: transaction.value
    }, {
      headers: {
        'x-access-token': user.accessToken
      }
    })
  }

  const handleBlur = (e) => e.target.value = transaction.value

  return (
    <section>
        <Typography
            variant="h4"
            component="h1"
            children="Transações"
        />
        <div style={{ background: palette.background.default, display: 'inline-block', padding: 24, borderRadius: 6, width: '50%' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'inline-block', paddingRight: 24 }}>
              <Typography component="p" children="Transferir para:" style={{ color: palette.text.primary, marginBottom: 6 }} />
              <TextField
                name="username"
                label="Usuário"
                style={{ color: palette.text.primary }}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'inline-block' }}>
              <TextField
                name="value"
                type="number"
                min="0"
                inputProps={{ step: ".01" }}
                label="Valor"
                style={{ color: palette.text.primary }}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
              <Button
                type="submit"
                variant="contained"
                children="Transferir"
                style={{ color: palette.background.default, background: palette.text.primary, marginTop: 24 }}
              />
          </form>
        </div>
    </section>
  )
}

export default Transactions;
