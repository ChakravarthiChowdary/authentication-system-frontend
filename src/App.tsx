import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import "./App.css";

import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import { useAppSelector } from "./store/store";
import UpdatePassword from "./pages/UpdatePassword";
import SignUp from "./pages/SignUp";

function App() {
  const user = useAppSelector((state) => state.app.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname !== "/") {
      navigate("/");
    }
  }, [user, navigate, location]);

  return (
    <>
      <Navbar />
      <Routes>
        {!user && (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
          </>
        )}
        {user && user.passwordChangeRequired && (
          <Route path="/" element={<UpdatePassword />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
