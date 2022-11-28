import { ThemeContext } from "@emotion/react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Extract = () => {
  const { user, displayMessage} = useContext(AuthContext);
  const [transactions, setTransactions] = useState(false);
  const [date, setDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { palette } = useContext(ThemeContext);
  const { account_id } = user;

  const handleChange = (e) => {
    const { value } = e.target;
    setDate(value);
  }

  const handleClick = (e) => {
    const { dataset } = e.target;
    getTransactions(`/api/transactions/${account_id+dataset.query}`);
  }

  const getTransactions = async (url) => {
    setLoading(true);

    const paramDate = date ? `?date=${date}` : '';
    const headers = { 'x-access-token': user.accessToken };
    const { transactions, message } = await fetch(url+paramDate, { headers })
    .then( (r) => {
      if ([200, 406].includes(r.status)) return r.json();
      return r;
    })
    .then( (r) => {
      if (r.message) return r;
      return { message: { content: "Não foi possível acessar o extrato", status: false } };
    });

    if (message.status) setTransactions(transactions);
    else setTransactions([]);
        
    displayMessage(message);
    setLoading(false);
  }

  useEffect(() => {
    if (!transactions) getTransactions(`/api/transactions/${account_id}`);
  })
    
    
  return (
    <section>
      <Typography
        component="h1"
        variant="h4"
        children="Extrato"
      />
      <Button
        data-query="/cash-in"
        children="Cash In"
        onClick={handleClick}
        style={{
          background: palette.background.default,
          color: palette.text.primary,
          marginRight: 12,
          padding: 8
        }}
      />
      <Button
        data-query="/cash-out"
        children="Cash Out"
        onClick={handleClick}
        style={{
          background: palette.background.default,
          color: palette.text.primary,
          marginRight: 12,
          padding: 8
        }}
      />
      <Button
        data-query=""
        children="Both"
        onClick={handleClick}
        style={{
          background: palette.background.default,
          color: palette.text.primary,
          marginRight: 12,
          padding: 8
        }}
      />
      <TextField
        type="date"
        size="small"
        onChange={handleChange}
        style={{
          background: palette.background.default,
          color: palette.text.primary,
          colorScheme: 'dark',
          borderRadius: 6
        }}
      />
      <Box
        sx={{
          marginTop: '6px',
          padding: 6,
          display: 'block',
          color: palette.text.primary,
          backgroundColor: palette.background.default,
          '&:hover': {
            backgroundColor: palette.background.default+'ee',
          },
          borderRadius: '6px'
        }}
      >
        {loading
          ? <CircularProgress />
          : transactions.length
            ? transactions.map( (transaction, index) => {
              const { created_at } = transaction;
              const dia = new Date(created_at).getDate();
              const mes = new Date(created_at).getMonth() + 1;
              const ano = new Date(created_at).getFullYear();
              const hora = new Date(created_at).getHours().toString().padStart(2, '0');
              const minuto = new Date(created_at).getMinutes().toString().padStart(2, '0');
              const debited = transaction.debited_account_id === user.account_id;

            return (
              <Box
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                  borderBottom: '1px dashed white',
                  color: debited && 'firebrick'
                }}
              >
                <Typography
                  component="span"
                  children={transaction.username}
                />
                <Typography
                  key={index}
                  component="p"
                  children={(debited ? ' - ' : ' + ') + 'R$ ' + transaction.value.toFixed(2)}
                />
                <Typography
                  component="span"
                  children={`${dia}/${mes}/${ano} - ${hora}:${minuto}`}
                />
              </Box>
            )
          }) : "Não encontramos registros em sua conta"
        }
      </Box>
    </section>
  )
}

export default Extract;
