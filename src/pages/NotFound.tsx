import { Alert, Container } from "@mui/material";
import React from "react";

const NotFound = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <Alert severity="error">
        Oops ! We are not able to find the page you are searching for. (ERROR
        404.)
      </Alert>
    </Container>
  );
};

export default NotFound;
