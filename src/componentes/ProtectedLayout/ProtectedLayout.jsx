import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Link,
  ListItemIcon,
  Tooltip,
  Container,
} from "@mui/material";
import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, useAuth } from "../../hooks/useAuth";
import { Logout, MonetizationOn } from "@mui/icons-material";
import { ThemeContext } from "@emotion/react";

const ProtectedLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuth();
  const { logout } = useContext(AuthContext);
  const { palette } = useContext(ThemeContext);

  const open = Boolean(anchorEl);
  
  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (!user) return <Navigate to="/" />;

  const { username } = user.user;
  const [firstLetter] = username.split("");

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
            backgroundColor: palette.background.default+'ee',
          },
        }}
      >
        <nav>
          <Box style={{ margin: '0 15px'}}>
            <Tooltip title="Profile">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open && "account-menu"}
                aria-haspopup="true"
                aria-expanded={open && "true"}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {firstLetter.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: palette.background.paper,
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar />{" "}
              <Link href="/dashboard/profile" style={{ color: palette.action.active, textTransform: 'capitalize' }} underline="none">
                {username}
              </Link>
            </MenuItem>
            <MenuItem>
              <MonetizationOn />{" "}
              <Link href="/dashboard/transactions" style={{ color: palette.action.active, textTransform: 'capitalize' }} underline="none">
                Transações
              </Link>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => logout()}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </nav>
      </Box>
      <Container style={{ padding: 24 }}>
        <Outlet />
      </Container>
    </div>
  );
};

export default ProtectedLayout;
