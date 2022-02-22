import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import {
  ClearError,
  SignIn,
  SignInError,
  SignInStart,
  SignOut,
  SignUp,
  SignUpError,
  SignUpStart,
} from "./auth.actions";

export interface AuthState {
  user: User;
  loading: boolean;
  error: string;
}

export const INITIAL_STATE: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  INITIAL_STATE,
  on(SignInStart, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),

  on(SignIn, (state, props) => {
    const { email, userId, token, expirationDate } = props.user;

    const user = new User(email, userId, token, expirationDate);

    return {
      ...state,
      user,
      loading: false,
    };
  }),

  on(SignInError, (state, props) => ({
    ...state,
    user: null,
    loading: false,
    error: props.error,
  })),

  on(SignUpStart, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),

  on(SignUp, (state, props) => {
    const { email, userId, token, expirationDate } = props.user;

    const user = new User(email, userId, token, expirationDate);

    return {
      ...state,
      user,
      loading: false,
    };
  }),

  on(SignUpError, (state, props) => ({
    ...state,
    user: null,
    error: props.error,
  })),

  on(ClearError, (state) => ({ ...state, error: null })),

  on(SignOut, (state) => ({ ...state, user: null }))
);
