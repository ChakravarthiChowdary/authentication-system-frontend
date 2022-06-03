import React, { Dispatch, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import "./App.css";

import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import { useAppSelector } from "./store/store";
import UpdatePassword from "./pages/UpdatePassword";
import SignUp from "./pages/SignUp";
import { useDispatch } from "react-redux";
import { CLEAN_UP_AUTH_STATE } from "./store/actions";

function App() {
  const { user, error } = useAppSelector((state) => state.app);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    if (user && location.pathname !== "/") {
      navigate("/");
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (!user && error) dispatch({ type: CLEAN_UP_AUTH_STATE });
  }, [location.pathname, dispatch, error, user]);

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
