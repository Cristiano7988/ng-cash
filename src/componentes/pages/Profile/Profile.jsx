import { ThemeContext } from "@emotion/react";
import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Profile = () => {
  const { user, displayMessage } = useContext(AuthContext);
  const { palette } = useContext(ThemeContext);
  const [account, setAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const { account_id } = user;

  const getAccount = async () => {
    setLoading(true);

    const headers = { 'x-access-token': user.accessToken };
    const { account, message } = await fetch(`/api/accounts/${account_id}`, { headers })
    .then( (r) => {
      if ([200, 406].includes(r.status)) return r.json();
      return r;
    })
    .then( (r) => {
      if (r.message) return r;
      return { message : { content: "Não foi possível acessar a conta", status: false } };
    });

    if (message.status) setAccount(account);
    else setAccount({ balance: "Indinsponível" });
    
    displayMessage(message);
    setLoading(false);
  }

  useEffect(() => {
    if (!account) getAccount();
  })

  return (
    <section>
      <Typography
        variant="h4"
        component="h1"
        children="Profile"
      />
      <div style={{ background: palette.background.default, display: 'inline-block', margin: '24px 0', padding: 24, borderRadius: 6, width: '50%' }}>
        {loading
          ? <CircularProgress />
          : <Typography
            component="p"
            style={{ color: palette.text.primary }}
            children={ "Saldo: " + (!isNaN(account.balance) ? ' R$ ' : '') + account.balance?.toFixed(2) }
          />
        }
      </div>
    </section>
  )
}

export default Profile;
