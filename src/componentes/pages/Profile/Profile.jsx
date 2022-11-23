import { ThemeContext } from "@emotion/react";
import { Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/useAuth";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { palette } = useContext(ThemeContext);
  const [account, setAccount] = useState(false);
  const { account_id } = user.user;

  useEffect(() => {
    const getAccount = async () => {
      const { account, status } = await fetch(`/api/accounts/${account_id}`, {
        headers: {
          'x-access-token': user.accessToken
        }
      }).then(r => r.status === 200 ? r.json() : { status: false })

      if (status) setAccount(account)
    }
    
    if (!account) getAccount()
  })

  return (
    <section>
        <Typography
            variant="h4"
            component="h1"
            children="Profile"
        />
        <div style={{ background: palette.background.default, display: 'inline-block', margin: '24px 0', padding: 24, borderRadius: 6, width: '50%' }}>
          <Typography component="p" style={{ color: palette.text.primary }}>
            Saldo: {account ? (
              'R$ ' + account.balance.toFixed(2)
            ) : 'Indisponível'}
          </Typography>
        </div>
    </section>
  )
}

export default Profile;
