import React, { Dispatch, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { updatePassword } from "../store/actions";
import { useAppSelector } from "../store/store";
import { LoadingButton } from "@mui/lab";

const theme = createTheme();

export default function UpdatePassword() {
  const [uiError, setUiError] = useState("");
  const [form, setForm] = useState({
    values: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    errors: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const dispatch: Dispatch<any> = useDispatch();
  const { loading, error, user } = useAppSelector((state) => state.app);

  useEffect(() => {
    let timer: NodeJS.Timeout | null;

    if (uiError !== "") {
      timer = setTimeout(() => {
        setUiError("");
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uiError]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form.values;
    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      setUiError("All are mandatory fields");
      setForm((prevState) => ({
        values: prevState.values,
        errors: {
          currentPassword:
            prevState.values.currentPassword === ""
              ? "Current password is required"
              : "",
          newPassword:
            prevState.values.newPassword === ""
              ? "New password is required"
              : "",
          confirmPassword:
            prevState.values.confirmPassword === ""
              ? "Confirm Password is required"
              : "",
        },
      }));
      return;
    }

    if (form.errors.confirmPassword !== "") {
      setUiError("Passwords should match");
      setForm((prevState) => ({
        values: prevState.values,
        errors: {
          ...prevState.errors,
          confirmPassword:
            prevState.values.confirmPassword === ""
              ? "Confirm password is required"
              : form.errors.confirmPassword,
        },
      }));
    }

    if (
      form.errors.currentPassword === "" &&
      form.errors.newPassword === "" &&
      form.errors.confirmPassword === ""
    ) {
      dispatch(
        updatePassword(
          form.values.currentPassword,
          form.values.newPassword,
          form.values.confirmPassword
        )
      );
    }
  };

  const getConfirmPasswordError = (value: string) => {
    if (value === "") {
      return "Confirm password is required";
    } else if (form.values.newPassword !== value) {
      return "Passwords should match";
    } else {
      return "";
    }
  };

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "currentPassword":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            currentPassword: value,
          },
          errors: {
            ...prevState.errors,
            currentPassword: value === "" ? "Current password is required" : "",
          },
        }));
        break;
      case "newPassword":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            newPassword: value,
          },
          errors: {
            ...prevState.errors,
            newPassword: value === "" ? "New password is required" : "",
          },
        }));
        break;
      case "confirmPassword":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            confirmPassword: value,
          },
          errors: {
            ...prevState.errors,
            confirmPassword: getConfirmPasswordError(value),
          },
        }));
        break;
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
            sx={{ fontFamily: "poppins", mb: 3 }}
          >
            Update your password
          </Typography>

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="currentPassword"
                  required
                  fullWidth
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  autoFocus
                  value={form.values.currentPassword}
                  error={form.errors.currentPassword !== ""}
                  helperText={form.errors.currentPassword}
                  onChange={onInputChange}
                  FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
                  sx={{ fontFamily: "poppins" }}
                  InputProps={{ sx: { fontFamily: "poppins" } }}
                  InputLabelProps={{ sx: { fontFamily: "poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={form.values.newPassword}
                  error={form.errors.newPassword !== ""}
                  helperText={form.errors.newPassword}
                  onChange={onInputChange}
                  FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
                  InputProps={{ sx: { fontFamily: "poppins" } }}
                  InputLabelProps={{ sx: { fontFamily: "poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={form.values.confirmPassword}
                  error={form.errors.confirmPassword !== ""}
                  helperText={form.errors.confirmPassword}
                  onChange={onInputChange}
                  FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
                  InputProps={{ sx: { fontFamily: "poppins" } }}
                  InputLabelProps={{ sx: { fontFamily: "poppins" } }}
                />
              </Grid>
            </Grid>
            {(uiError !== "" || error) && (
              <Alert severity="error" sx={{ mt: 2, fontFamily: "poppins" }}>
                {error ? error.message : uiError}
              </Alert>
            )}
            <Alert severity="info" sx={{ mt: 3 }}>
              You need to update password for security reasons and you last
              password update is more than 30 days.
            </Alert>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontFamily: "poppins" }}
              onClick={handleSubmit}
              loading={loading}
            >
              Update password
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
