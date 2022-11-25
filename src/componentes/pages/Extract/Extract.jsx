import { ThemeContext } from "@emotion/react";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Extract = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState(false);
    const [date, setDate] = useState(false);
    const { palette } = useContext(ThemeContext);
    const { account_id } = user.user;

    const handleClick = async (e) => {
        const { dataset } = e.target;
        const paramDate = date ? `?date=${date}` : '';

        const resposta = await fetch(`/api/transactions/${account_id}/cash-${dataset.query+paramDate}`, {
            headers: {
                'x-access-token': user.accessToken
            }
        })
        .then(r => r.ok ? r.json() : false)

        if (resposta.status) setTransactions(resposta.transactions)
    }

    const getTransactions = async () => {
        const paramDate = date ? `?date=${date}` : '';
        const resposta = await fetch(`/api/transactions/${account_id+paramDate}`, {
            headers: {
                'x-access-token': user.accessToken
            }
        })
        .then(r => r.ok ? r.json() : false)

        if (resposta.status) setTransactions(resposta.transactions)
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setDate(value);
    } 


    useEffect(() => {
        if (!transactions) getTransactions()
    })
    
    return <section>
        <Typography
            component="h1"
            variant="h4"
            children="Extrato"
        />
        <Button
            data-query="in"
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
            data-query="out"
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
            data-query="out"
            children="Both"
            onClick={getTransactions}
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
            {transactions.length ? transactions.map( (transaction, index) => {
                const { created_at } = transaction;
                const dia = new Date(created_at).getDate();
                const mes = new Date(created_at).getMonth() + 1;
                const ano = new Date(created_at).getFullYear();
                const hora = new Date(created_at).getHours().toString().padStart(2, '0');
                const minuto = new Date(created_at).getMinutes().toString().padStart(2, '0');
                const debited = transaction.debited_account_id === user.user.account_id;

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
            })  : "Não encontramos registros em sua conta" }
        </Box>
    </section>
}

export default Extract;
