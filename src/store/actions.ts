import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";

export const SIGN_IN_START = "SIGN_IN_START";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAIL = "SIGN_IN_FAIL";

export const SIGN_UP_START = "SIGN_UP_START";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAIL = "SIGN_UP_FAIL";

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
  files: FileList | null
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      dispatch({ type: SIGN_UP_START });

      const response = await fetch("http://localhost:5000/app/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name, confirmPassword }),
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
