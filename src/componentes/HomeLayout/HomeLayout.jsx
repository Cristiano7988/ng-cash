import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useContext, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
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

  const { user } = useAuth();  
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
      <Outlet />
    </div>
  )
};

export default HomeLayout;
