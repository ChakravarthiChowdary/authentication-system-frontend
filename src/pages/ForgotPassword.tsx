import React, { Dispatch, useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Copyright from "../components/CopyRight";
import { Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  CLEAN_UP_AUTH_STATE,
  forgotPassword,
  signUpUser,
} from "../store/actions";
import { useAppSelector } from "../store/store";
import { LoadingButton } from "@mui/lab";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

interface FormState {
  values: {
    email: string;
    password: string;
    confirmPassword: string;
    securityQuestion: string;
    securityAnswer: string;
    dateOfBirth: null | Date;
  };
  errors: {
    email: string;
    password: string;
    confirmPassword: string;
    securityQuestion: string;
    securityAnswer: string;
    dateOfBirth: string;
  };
}

export default function ForgotPassword() {
  const [uiError, setUiError] = useState("");
  const [form, setForm] = useState<FormState>({
    values: {
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "1",
      securityAnswer: "",
      dateOfBirth: null,
    },
    errors: {
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
      dateOfBirth: "",
    },
  });
  const dispatch: Dispatch<any> = useDispatch();
  const { loading, error, passwordUpdated } = useAppSelector(
    (state) => state.app
  );

  const resetForm = () => {
    setForm({
      values: {
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "1",
        securityAnswer: "",
        dateOfBirth: null,
      },
      errors: {
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: "",
        dateOfBirth: "",
      },
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null;

    if (uiError !== "" || error) {
      timer = setTimeout(() => {
        setUiError("");
        dispatch({ type: CLEAN_UP_AUTH_STATE });
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uiError, dispatch, error]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null;
    if (passwordUpdated) {
      resetForm();
      timer = setTimeout(() => {
        dispatch({ type: CLEAN_UP_AUTH_STATE });
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [passwordUpdated]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const {
      email,
      password,
      confirmPassword,
      securityAnswer,
      securityQuestion,
      dateOfBirth,
    } = form.values;
    if (
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      securityAnswer === "" ||
      securityQuestion === "" ||
      !dateOfBirth
    ) {
      setUiError("All are mandatory fields");
      setForm((prevState) => ({
        values: prevState.values,
        errors: {
          email: prevState.values.email === "" ? "Email is required" : "",
          password:
            prevState.values.password === "" ? "Password is required" : "",
          confirmPassword:
            prevState.values.confirmPassword === ""
              ? "Confirm Password is required"
              : "",
          securityAnswer:
            prevState.values.securityAnswer === ""
              ? "Please provide security answer"
              : "",
          securityQuestion:
            prevState.values.securityQuestion === ""
              ? "Please select security question"
              : "",
          dateOfBirth: !prevState.values.dateOfBirth
            ? "Date of birth is required"
            : "",
        },
      }));
      if (email === "" && password === "" && confirmPassword === "") return;
    }

    if (form.errors.email !== "") {
      setUiError("Email is not valid");
      setForm((prevState) => ({
        values: prevState.values,
        errors: {
          ...prevState.errors,
          email:
            prevState.values.email === ""
              ? "Email is required"
              : form.errors.email,
        },
      }));
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
      form.errors.password === "" &&
      form.errors.confirmPassword === "" &&
      form.errors.email === "" &&
      form.errors.securityAnswer === "" &&
      form.errors.securityQuestion === "" &&
      form.errors.dateOfBirth === "" &&
      form.values.dateOfBirth
    ) {
      dispatch(
        forgotPassword(
          form.values.email,
          form.values.password,
          form.values.confirmPassword,
          form.values.dateOfBirth,
          form.values.securityQuestion,
          form.values.securityAnswer
        )
      );
    }
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const getEmailError = (value: string) => {
    if (value === "") {
      return "Email is required";
    } else if (!validateEmail(value)) {
      return "Email is not valid";
    } else {
      return "";
    }
  };

  const getConfirmPasswordError = (value: string) => {
    if (value === "") {
      return "Confirm password is required";
    } else if (form.values.password !== value) {
      return "Passwords should match";
    } else {
      return "";
    }
  };

  const onInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const value = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "email":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            email: value,
          },
          errors: {
            ...prevState.errors,
            email: getEmailError(value),
          },
        }));
        break;
      case "password":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            password: value,
          },
          errors: {
            ...prevState.errors,
            password: value === "" ? "Password is required" : "",
            confirmPassword: getConfirmPasswordError(value),
          },
        }));
        break;
      case "confirmpassword":
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
      case "security":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            securityQuestion: value,
          },
          errors: {
            ...prevState.errors,
            securityQuestion:
              value == "" ? "Security question is required" : "",
          },
        }));
        break;
      case "securityanswer":
        setForm((prevState) => ({
          values: {
            ...prevState.values,
            securityAnswer: value,
          },
          errors: {
            ...prevState.errors,
            securityAnswer: value === "" ? "Security answer is required" : "",
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
            marginTop: 3,
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
            Forgot Password
          </Typography>

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={form.values.email}
                  error={form.errors.email !== ""}
                  helperText={form.errors.email}
                  onChange={onInputChange}
                  FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
                  InputProps={{ sx: { fontFamily: "poppins" } }}
                  InputLabelProps={{ sx: { fontFamily: "poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!form.values.dateOfBirth}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      label="Date of birth"
                      openTo="year"
                      views={["year", "month", "day"]}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(e) =>
                        setForm((prevState) => ({
                          values: {
                            ...prevState.values,
                            dateOfBirth: e,
                          },
                          errors: {
                            ...prevState.errors,
                            dateOfBirth: !e ? "Date of birth is required" : "",
                          },
                        }))
                      }
                      value={form.values.dateOfBirth}
                    />
                  </LocalizationProvider>
                  {form.errors.dateOfBirth !== "" && (
                    <FormHelperText
                      error={!form.values.dateOfBirth}
                      sx={{ m: 0, mt: 1 }}
                    >
                      {"Date of birth is required"}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid xs={12} item>
                {" "}
                <FormControl fullWidth>
                  <InputLabel id="security-questions">
                    Security question
                  </InputLabel>
                  <Select
                    labelId="security-questions"
                    id="security"
                    name="security"
                    label="Security question"
                    value={form.values.securityQuestion}
                    error={form.errors.securityQuestion !== ""}
                    onChange={onInputChange}
                  >
                    <MenuItem value={1}>What is your birth place ?</MenuItem>
                    <MenuItem value={2}>What is your first pet name ?</MenuItem>
                    <MenuItem value={3}>
                      Which is your favourite sport ?
                    </MenuItem>
                  </Select>
                  {form.errors.securityQuestion !== "" && (
                    <FormHelperText
                      error={form.errors.securityQuestion !== ""}
                      sx={{ m: 0, mt: 1 }}
                    >
                      {form.errors.securityQuestion}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="securityanswer"
                  label="Security answer"
                  id="securityanswer"
                  value={form.values.securityAnswer}
                  error={form.errors.securityAnswer !== ""}
                  helperText={form.errors.securityAnswer}
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
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={form.values.password}
                  error={form.errors.password !== ""}
                  helperText={form.errors.password}
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
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmpassword"
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
            {passwordUpdated && (
              <Alert severity="success" sx={{ mt: 2, fontFamily: "poppins" }}>
                Password updated. Please login to continue.
              </Alert>
            )}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontFamily: "poppins" }}
              onClick={handleSubmit}
              loading={loading}
            >
              Forgot Password
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink to="/">
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "poppins", mb: 4 }}
                  >
                    {" "}
                    Remember your password? Sign in
                  </Typography>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
