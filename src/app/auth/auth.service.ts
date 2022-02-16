import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { environment } from "../../environments/environment";

interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp({ email, password }: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser",
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          params: {
            key: environment.firebaseAPIKey,
          },
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  signIn({ email, password }: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword",
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          params: {
            key: environment.firebaseAPIKey,
          },
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  signOut() {
    this.user.next(null);

    localStorage.removeItem("@course-angular:user");

    this.router.navigate(["/auth"]);

    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);

    this.tokenExpirationTimer = null;
  }

  autoSignOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }

  checkValidUserCache() {
    const user = JSON.parse(localStorage.getItem("@course-angular:user"));

    if (!user) return;

    const { email, id, _token, _tokenExpirationDate } = user;

    const loadedUser = new User(
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );

    if (!loadedUser.token) return;

    const expirationDuration =
      new Date(_tokenExpirationDate).getTime() - new Date().getTime();
    this.autoSignOut(expirationDuration);

    this.user.next(loadedUser);
  }

  private handleAuthentication({
    email,
    localId,
    idToken,
    expiresIn,
  }: AuthResponse) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

    const user = new User(email, localId, idToken, expirationDate);

    this.user.next(user);

    this.autoSignOut(+expiresIn * 1000);

    localStorage.setItem("@course-angular:user", JSON.stringify(user));
  }

  private handleError(httpError: HttpErrorResponse) {
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

    return throwError(message);
  }
}
