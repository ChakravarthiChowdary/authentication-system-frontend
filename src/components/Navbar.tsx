import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { useAppSelector } from "../store/store";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.app.user);

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
            <Avatar src={user.photoUrl} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
