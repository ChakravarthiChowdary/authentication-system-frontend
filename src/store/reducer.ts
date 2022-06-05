import { AnyAction } from "redux";

import { AuthState } from "../types";
import {
  CLEAN_UP_AUTH_STATE,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_START,
  FORGOT_PASSWORD_SUCCESS,
  SIGN_IN_FAIL,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_UP_FAIL,
  SIGN_UP_START,
  SIGN_UP_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
  AUTH_AUTOLOGIN_FAIL,
  AUTH_AUTOLOGIN_START,
  AUTH_AUTOLOGIN_SUCCESS,
} from "./actions";

const initalState: AuthState = {
  loading: false,
  user: null,
  error: null,
  passwordChangeRequired: false,
  passwordUpdated: false,
};

export const reducer = (state = initalState, action: AnyAction) => {
  switch (action.type) {
    case SIGN_IN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        passwordChangeRequired: action.payload.passwordChangeRequired,
        user: action.payload,
      };
    case SIGN_IN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        passwordChangeRequired: false,
      };
    case SIGN_UP_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        passwordChangeRequired: action.payload.passwordChangeRequired,
        user: action.payload,
      };
    case SIGN_UP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        passwordChangeRequired: false,
      };
    case UPDATE_PASSWORD_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        passwordChangeRequired: false,
        user: action.payload,
      };
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FORGOT_PASSWORD_START:
      return {
        ...state,
        loading: true,
        error: null,
        passwordUpdated: false,
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        passwordUpdated: true,
        error: null,
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        passwordUpdated: false,
        error: action.payload,
      };
    case AUTH_AUTOLOGIN_START:
      return {
        ...state,
        autoLoginLoading: true,
      };
    case AUTH_AUTOLOGIN_FAIL:
      return {
        ...state,
        autoLoginLoading: false,
        user: null,
      };
    case AUTH_AUTOLOGIN_SUCCESS:
      return {
        ...state,
        autoLoginLoading: false,
        user: action.payload,
      };
    case CLEAN_UP_AUTH_STATE:
      return initalState;
    default:
      return state;
  }
};
