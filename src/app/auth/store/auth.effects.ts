import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import {
  SignIn,
  SignInAuto,
  SignInError,
  SignInStart,
  SignOut,
  SignUp,
  SignUpError,
  SignUpStart,
} from "./auth.actions";
import { AuthService } from "../auth.service";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../user.model";

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  signIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInStart),
      exhaustMap(({ credentials }) => {
        return this.authService.signIn(credentials).pipe(
          tap(({ expiresIn }) =>
            this.authService.autoSignOut(+expiresIn * 1000)
          ),
          map((user) => SignIn(this.handleSignIn(user))),
          catchError((httpError) => {
            const error = this.handleError(httpError);

            return of(SignInError({ error }));
          })
        );
      })
    );
  });

  autoSignIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInAuto),
      map(() => {
        const user = JSON.parse(localStorage.getItem("@course-angular:user"));

        if (!user) return { type: "DEFAULT_CASE" };

        const { email, id, _token, _tokenExpirationDate } = user;

        const loadedUser = new User(
          email,
          id,
          _token,
          new Date(_tokenExpirationDate)
        );

        if (!loadedUser.token) return { type: "DEFAULT_CASE" };

        const expirationDuration =
          new Date(_tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.autoSignOut(expirationDuration);

        return SignIn({
          user: {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(_tokenExpirationDate),
            redirect: false,
          },
        });
      })
    );
  });

  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignUpStart),
      exhaustMap(({ credentials }) => {
        return this.authService.signUp(credentials).pipe(
          tap(({ expiresIn }) =>
            this.authService.autoSignOut(+expiresIn * 1000)
          ),
          map((user) => SignUp(this.handleSignIn(user))),
          catchError((httpError) => {
            const error = this.handleError(httpError);

            return of(SignUpError({ error }));
          })
        );
      })
    );
  });

  signOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SignOut),
        tap(() => {
          this.authService.clearAutoSignOut();
          localStorage.removeItem("@course-angular:user");
          this.router.navigate(["/auth"]);
        })
      );
    },
    { dispatch: false }
  );

  signRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SignIn),
        tap(({ user }) => {
          if (user.redirect) this.router.navigate(["/"]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  private handleSignIn({ email, localId, idToken, expiresIn }: AuthResponse): {
    user: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    };
  } {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

    const user = new User(email, localId, idToken, expirationDate);

    localStorage.setItem("@course-angular:user", JSON.stringify(user));

    return {
      user: {
        email: email,
        userId: localId,
        token: idToken,
        expirationDate,
        redirect: true,
      },
    };
  }

  private handleError(httpError: HttpErrorResponse): string {
    let message = "An unknown error ocurred";

    if (httpError?.error?.error) {
      switch (httpError.error.error.message) {
        case "EMAIL_EXISTS":
          message = "This email already exists";
          break;
        case "EMAIL_EXISTS":
        case "EMAIL_NOT_FOUND":
        case "USER_DISABLED":
          message = "User/password is incorrect. Try again.";
          break;

        default:
          break;
      }
    }

    return message;
  }
}
