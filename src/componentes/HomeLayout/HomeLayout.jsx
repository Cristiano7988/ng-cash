import { Navigate, NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../hooks/useAuth";
import { useContext, useState } from 'react';
import { Box, Tabs, Tab, Container, Alert } from '@mui/material';
import { ThemeContext } from "@emotion/react";

const getIndex = (links, innerText = null) => {
  const { pathname } = window.location;
  const [link] = links.filter(link => link.to === pathname || link.label === innerText);
  const index = links.indexOf(link)
  return index;
}

const HomeLayout = () => {
  const links = [
    { label: "Home", to:"/" },
    { label: "Cadastro", to:"/cadastro" },
    { label: "Login", to:"/login" }
  ];

  const { user, message } = useContext(AuthContext); 
  const [value, setValue] = useState(getIndex(links));
  const { palette } = useContext(ThemeContext);

  const linkStyled = {
    textDecoration: 'none',
    color: palette.action.active
  }

  const handleClick = (event) => {
    const { innerText } = event.target;
    const index = getIndex(links, innerText);
    setValue(index);
  }

  if (user) return <Navigate to="/dashboard/profile" />;

  return (
    <div>
      <Box
        sx={{
          width: '100%',
          height: 75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'right',
          backgroundColor: palette.background.default,
          '&:hover': {
            backgroundColor: palette.background.default+'ee'
          },
        }}
      >
        <nav style={{ textAlign: 'right' }}>
          <Tabs style={{ display: 'inline-block' }} value={value} onClick={handleClick} aria-label="disabled tabs">
            {links.map((link, index) =>
              <NavLink
                key={index}
                to={link.to}
                style={linkStyled}
                children={<Tab label={link.label} />}
                onClick={handleClick}
              />
            )}
          </Tabs>
        </nav>
      </Box>
      <Container style={{ padding: 24 }}>
        {message && <Alert style={{ position: 'absolute', opacity: .975 }} severity={message.status ? "success" : "error"}>{message.content}</Alert>}
        <Outlet />
      </Container>
    </div>
  )
};

export default HomeLayout;
