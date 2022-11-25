import { ThemeContext } from "@emotion/react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Extract = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState(false);
    const { palette } = useContext(ThemeContext);
    const { account_id } = user.user;

    useEffect(() => {
        const getTransactions = async () => {
            const resposta = await fetch(`/api/transactions/credited/${account_id}`, {
                headers: {
                    'x-access-token': user.accessToken
                }
            })
            .then(r => r.ok ? r.json() : false)

            if (resposta.status) setTransactions(resposta.transactions)
        }

        if (!transactions) getTransactions()
    })
    
    return <section>
        <Typography
            component="h1"
            variant="h4"
            children="Extrato"
        />
        <Box
            sx={{
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
