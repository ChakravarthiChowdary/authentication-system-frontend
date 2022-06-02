import React, { Dispatch, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { CLEAN_UP_AUTH_STATE, signInUser } from "../store/actions";
import Copyright from "../components/CopyRight";
import { useAppSelector } from "../store/store";

const theme = createTheme();

const SignIn = () => {
  const [uiError, setUIError] = useState("");
  const [form, setForm] = useState({
    values: {
      email: "",
      password: "",
    },
    errors: {
      email: "",
      password: "",
    },
  });
  const { error, loading } = useAppSelector((state) => state.app);

  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout | null;
    if (error) {
      timer = setTimeout(() => {
        dispatch({ type: CLEAN_UP_AUTH_STATE });
      }, 4000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const getError = (value: string, field: string) => {
    if (value === "") {
      return `${field} cannot be left blank.`;
    } else if (field === "Email") {
      if (!validateEmail(value)) {
        return `${field} must be valid email.`;
      }
      return "";
    } else {
      return "";
    }
  };

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const name = event.target.name;
    setUIError("");

    if (error) {
      dispatch({ type: CLEAN_UP_AUTH_STATE });
    }

    if (name === "email") {
      setForm((prevState) => ({
        values: {
          password: prevState.values.password,
          email: value,
        },
        errors: {
          password: prevState.errors.password,
          email: getError(value, "Email"),
        },
      }));
    } else if (name === "password") {
      setForm((prevState) => ({
        values: {
          password: value,
          email: prevState.values.email,
        },
        errors: {
          password: getError(value, "Password"),
          email: prevState.errors.email,
        },
      }));
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    let emailError = "";
    let passwordError = "";

    if (
      form.errors.email !== "" ||
      form.errors.password !== "" ||
      form.values.email === "" ||
      form.values.password === ""
    ) {
      if (form.values.email === "") {
        setUIError("Email cannot be empty.");
        emailError = "Email cannot be empty.";
      }
      if (form.values.password === "") {
        setUIError(
          form.values.email === ""
            ? "Email and password cannot be blank."
            : "Password cannot be empty"
        );
        passwordError = "Password cannot be empty.";
      }
      if (form.errors.email !== "") {
        setUIError(form.errors.email);
      }
      if (form.errors.password !== "") {
        setUIError(form.errors.password);
      }

      setForm((prevState) => ({
        values: prevState.values,
        errors: {
          password: passwordError ? passwordError : form.errors.password,
          email: emailError ? emailError : form.errors.email,
        },
      }));
    } else {
      dispatch(signInUser(form.values.email, form.values.password));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontFamily: "poppins" }}
          >
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={form.values.email}
              error={form.errors.email !== ""}
              helperText={form.errors.email}
              onChange={onInputChange}
              FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
              InputProps={{ sx: { fontFamily: "poppins" } }}
              InputLabelProps={{ sx: { fontFamily: "poppins" } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={form.values.password}
              error={form.errors.password !== ""}
              helperText={form.errors.password}
              FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
              onChange={onInputChange}
              InputProps={{ sx: { fontFamily: "poppins" } }}
              InputLabelProps={{ sx: { fontFamily: "poppins" } }}
            />
            {(uiError !== "" || error) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error ? error.message : uiError}
              </Alert>
            )}

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              loading={loading}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <RouterLink to="/forgotpassword">
                  <Typography variant="body2" sx={{ fontFamily: "poppins" }}>
                    Forgot password?
                  </Typography>
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to="/register">
                  <Typography variant="body2" sx={{ fontFamily: "poppins" }}>
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
