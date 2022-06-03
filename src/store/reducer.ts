import { AnyAction } from "redux";

import { AuthState } from "../types";
import {
  CLEAN_UP_AUTH_STATE,
  SIGN_IN_FAIL,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_UP_FAIL,
  SIGN_UP_START,
  SIGN_UP_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
} from "./actions";

const initalState: AuthState = {
  loading: false,
  user: null,
  error: null,
  passwordChangeRequired: false,
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
    case CLEAN_UP_AUTH_STATE:
      return initalState;
    default:
      return state;
  }
};
