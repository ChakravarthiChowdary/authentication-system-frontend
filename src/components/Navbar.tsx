import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { useAppSelector } from "../store/store";
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CLEAN_UP_AUTH_STATE } from "../store/actions";

const settings = ["Profile", "Logout"];

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.app.user);
  const dispatch: React.Dispatch<any> = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const menuItemClickedHandler = (setting: string) => {
    if (setting === "Profile") navigate("/profile");
    else if (setting === "Logout") {
      navigate("/");
      localStorage.removeItem("user");
      dispatch({ type: CLEAN_UP_AUTH_STATE });
    }
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontFamily: "poppins" }}
          >
            Authentication System
          </Typography>
          {!user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={user.photoUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => menuItemClickedHandler(setting)}
                    sx={{ fontFamily: "poppins" }}
                  >
                    {setting}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
