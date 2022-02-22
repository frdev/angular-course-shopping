import { createAction, props } from "@ngrx/store";

export enum AuthTypeActions {
  AUTH_SIGNIN_START = "[Auth] Sign In Start",
  AUTH_SIGNIN = "[Auth] Sign In",
  AUTH_SIGNIN_ERROR = "[Auth] Sign In Error",
  AUTH_SIGNIN_AUTO = "[Auth] Sign In Auto",

  AUTH_SIGNUP_START = "[Auth] Sign Up Start",
  AUTH_SIGNUP = "[Auth] Sign Up",
  AUTH_SIGNUP_ERROR = "[Auth] Sign Up Error",

  AUTH_SIGNOUT = "[Auth] Sign Out",
  AUTH_SIGNOUT_AUTO = "[Auth] Sign Out Auto",

  AUTH_CLEAR_ERROR = "[Auth] Clear Error",
}

export const SignInStart = createAction(
  AuthTypeActions.AUTH_SIGNIN_START,
  props<{ credentials: { email: string; password: string } }>()
);

export const SignIn = createAction(
  AuthTypeActions.AUTH_SIGNIN,
  props<{
    user: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    };
  }>()
);

export const SignInError = createAction(
  AuthTypeActions.AUTH_SIGNIN_ERROR,
  props<{ error: string }>()
);

export const SignInAuto = createAction(AuthTypeActions.AUTH_SIGNIN_AUTO);

export const SignUpStart = createAction(
  AuthTypeActions.AUTH_SIGNUP_START,
  props<{ credentials: { email: string; password: string } }>()
);

export const SignUp = createAction(
  AuthTypeActions.AUTH_SIGNUP,
  props<{
    user: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    };
  }>()
);

export const SignUpError = createAction(
  AuthTypeActions.AUTH_SIGNUP_ERROR,
  props<{ error: string }>()
);

export const ClearError = createAction(AuthTypeActions.AUTH_CLEAR_ERROR);

export const SignOut = createAction(AuthTypeActions.AUTH_SIGNOUT);

export const SignOutAuto = createAction(AuthTypeActions.AUTH_SIGNOUT_AUTO);
