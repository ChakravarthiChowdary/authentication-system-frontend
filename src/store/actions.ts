import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { User } from "../types";
import { RootState } from "./store";

export const AUTH_AUTOLOGIN_START = "AUTH_AUTOLOGIN_START";
export const AUTH_AUTOLOGIN_SUCCESS = "AUTH_AUTOLOGIN_SUCCESS";
export const AUTH_AUTOLOGIN_FAIL = "AUTH_AUTOLOGIN_FAIL";

export const SIGN_IN_START = "SIGN_IN_START";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAIL = "SIGN_IN_FAIL";

export const SIGN_UP_START = "SIGN_UP_START";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAIL = "SIGN_UP_FAIL";

export const UPDATE_PASSWORD_START = "UPDATE_PASSWORD_START";
export const UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS";
export const UPDATE_PASSWORD_FAIL = "UPDATE_PASSWORD_FAIL";

export const FORGOT_PASSWORD_START = "FORGOT_PASSWORD_START";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL";

export const CLEAN_UP_AUTH_STATE = "CLEAN_UP_AUTH_STATE";

export const signInUser = (
  email: string,
  password: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: SIGN_IN_START });

      const response = await fetch("http://localhost:5000/app/v1/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.errors || result.error) {
        dispatch({
          type: SIGN_IN_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(result));

      dispatch({ type: SIGN_IN_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: SIGN_IN_FAIL, payload: error });
    }
  };
};

export const signUpUser = (
  email: string,
  password: string,
  name: string,
  confirmPassword: string,
  files: FileList | null,
  dateOfBirth: Date,
  securityQuestion: string,
  securityAnswer: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: SIGN_UP_START });

      const response = await fetch("http://localhost:5000/app/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          name,
          confirmPassword,
          dateOfBirth,
          securityAnswer,
          securityQuestion,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.errors || result.error) {
        dispatch({
          type: SIGN_UP_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      let uploadResult;

      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("image", files[0]);
        formData.append("userId", result._id);

        const uploadResponse = await fetch(
          "http://localhost:5000/app/v1/auth/upload/userprofilepic",
          {
            method: "POST",
            body: formData,
          }
        );

        uploadResult = await uploadResponse.json();

        if (uploadResult.errors || uploadResult.error) {
          dispatch({
            type: SIGN_UP_FAIL,
            payload: uploadResult.errors
              ? {
                  message: uploadResult.errors[0].msg,
                  statusCode: 500,
                  requestStatus: "Fail",
                }
              : uploadResult.error,
          });
          return;
        }
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...result,
          photoUrl: uploadResult ? uploadResult.photoUrl : "",
        })
      );

      dispatch({
        type: SIGN_UP_SUCCESS,
        payload: {
          ...result,
          photoUrl: uploadResult ? uploadResult.photoUrl : "",
        },
      });
    } catch (error) {
      dispatch({ type: SIGN_UP_FAIL, payload: error });
    }
  };
};

export const updatePassword = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_PASSWORD_START });

      const user = getState().app.user;

      const response = await fetch(
        "http://localhost:5000/app/v1/auth/updatepassword",
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
            email: user ? user.email : "",
            userId: user ? user.id : "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.errors || result.error) {
        dispatch({
          type: UPDATE_PASSWORD_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(result));

      dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: UPDATE_PASSWORD_FAIL, payload: error });
    }
  };
};

export const forgotPassword = (
  email: string,
  password: string,
  confirmPassword: string,
  dateOfBirth: Date,
  securityQuestion: string,
  securityAnswer: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: FORGOT_PASSWORD_START });

      const response = await fetch(
        "http://localhost:5000/app/v1/auth/forgotpassword",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            newPassword: password,
            confirmNewPassword: confirmPassword,
            dateOfBirth,
            securityAnswer,
            securityQuestion,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.errors || result.error) {
        dispatch({
          type: FORGOT_PASSWORD_FAIL,
          payload: result.errors
            ? {
                message: result.errors[0].msg,
                statusCode: 500,
                requestStatus: "Fail",
              }
            : result.error,
        });
        return;
      }

      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: {
          ...result,
        },
      });
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error });
    }
  };
};

export const autoLogin = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTH_AUTOLOGIN_START });
      let user = localStorage.getItem("user");
      if (user) {
        const userInfo: User = await JSON.parse(user);

        const currentDate = new Date();
        const expiryDate = new Date(userInfo.expiresIn);

        if (expiryDate < currentDate) {
          dispatch({ type: AUTH_AUTOLOGIN_FAIL });
          return;
        }

        dispatch({ type: AUTH_AUTOLOGIN_SUCCESS, payload: userInfo });
      } else {
        dispatch({ type: AUTH_AUTOLOGIN_FAIL });
      }
    } catch (error) {
      dispatch({ type: AUTH_AUTOLOGIN_FAIL, payload: error });
    }
  };
};
